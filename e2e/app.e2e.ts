import { LinksPage } from './app.po';

describe('links App', function() {
  let page: LinksPage;

  beforeEach(() => {
    page = new LinksPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('links works!');
  });
});
