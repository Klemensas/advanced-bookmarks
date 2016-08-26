/* eslint-env es6, node */
const express = require('express');
const sse = require('express-server-sent-events');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');
const bodyParser = require('body-parser');
const cors = require('cors');
const mkdirp = require('mkdirp');
const uuid = require('node-uuid');
const morgan = require('morgan')
const rimraf = require('rimraf')
const nightmare = require('nightmare')({
  show: false,
  width: 480,
  height: 270,
  useContentSize: true
});

const public = '/public/';

const db = low(__dirname + '/database.json', { storage: fileAsync });

const cardsDB = db.get('cards');
const groups = {};
Object.keys(cardsDB.value()).forEach(g => { groups[g] = cardsDB.get(g); });

const app = express();
app.use(require('express-status-monitor')());
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/static', express.static(__dirname + public));

const listeners = [];

app.get('/api/streamCards', sse, (req, res) => {
  listeners.push(res);
  const data = JSON.stringify(cardsDB.value());
  res.sse('event: cards\n');
  res.sse(`data: ${data}\n\n`);

  res.on('close', () => {
    const pos = listeners.indexOf(res);
    listeners.splice(pos, 1);
  });
})

app.post('/api/cards/add', (req, res) => {
  const data = req.body;
  const tag = data.tag;
  delete data.tag;

  if (!groups[tag]) {
    insertGroup(tag);
  }

  data.id = uuid.v1()
  const card = groups[tag].push(data).last().value();

  sendEvent({ card, tag, event: 'add' }, 'card');

  screenService(data, tag, () => {
    const card = groups[tag].find({ id: data.id}).assign({ screenshot: `static/${tag}/${data.id}.png` }).value();
    console.log('i don did da request', card);
    sendEvent({ card, tag, event: 'update' }, 'card')
  });

  return res.status(200).end();
})

app.delete('/api/cards/:tag/:card', (req, res) => {
  const tag = req.params['tag'];
  const card = req.params['card'];
  groups[tag].remove({ id: card }).value();
  sendEvent({ card, tag, event: 'remove' }, 'card');
  let group = groups[tag].value();
  if (!group.length) {
    rimraf(__dirname + public + tag, {}, (e) => { console.log('rimraf stuff', e )});
    cardsDB.unset(tag).value();
  } else {
    rimraf(__dirname + public + tag + `/${card}.png`, {}, (e) => { console.log('rimmraf file', e)});
  }
  return res.status(200).end();
})

function insertGroup(group) {
  cardsDB.set(group, []).value();
  groups[group] = cardsDB.get(group);
  return;
}

function sendEvent(dat, event) {
  const data = JSON.stringify(dat);
  listeners.forEach(l => {
    l.sse(`event: ${event}\n`);
    l.sse(`data: ${data}\n\n`);
  });
}

const screenService = (function() {
  const store = __dirname + public;
  let busy = false;
  let queue = [];

  function getScreenshot(card, tag, cb) {
    queue.push({ card, tag, cb });
    if (!busy) {
      busy = true;
      process();
    }
  }
  function process() {
    if (!queue.length) {
      busy = false;
      return;
    }
    const item = queue.shift();
    takeScreen(item);
  }
  function takeScreen(item) {
    let time = 5000;
    let target = item.card.url;
    let width = 480;
    let height = 270;
    if (item.card.image) {
      if (item.card.image.time) { time = item.card.image.time; }
      if (item.card.image.grab) { target = item.card.image.grab; }
      if (item.card.image.sizeX) { width = item.card.image.sizeX; }
      if (item.card.image.sizeY) { height = item.card.image.sizeY; }
    }
    mkdirp(`${store}${item.tag}`, () => {
      nightmare
        .goto(target)
        .viewport(width, height)
        .wait(time)
        .screenshot(`${store}${item.tag}/${item.card.id}.png`)
        .then(process)
        .then(item.cb)
        .catch(error => console.log('Totally unexpected error, server is dead now', error))
    });
  }

  return getScreenshot;
}());
app.listen(3000)