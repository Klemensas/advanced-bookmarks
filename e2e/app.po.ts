export class LinksPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('links-app h1')).getText();
  }
}
