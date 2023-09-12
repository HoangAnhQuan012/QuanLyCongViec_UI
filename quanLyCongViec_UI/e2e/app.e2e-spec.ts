import { quanLyCongViecTemplatePage } from './app.po';

describe('quanLyCongViec App', function() {
  let page: quanLyCongViecTemplatePage;

  beforeEach(() => {
    page = new quanLyCongViecTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
