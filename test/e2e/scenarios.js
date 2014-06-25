'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /state1 when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/state1");
  });


  describe('state1', function() {

    beforeEach(function() {
      browser.get('index.html#/state1');
    });


    it('should render state1 when user navigates to /state1', function() {
      expect(element.all(by.css('[ui-view] h1')).first().getText()).
        toMatch(/State 1/);
    });

  });


  describe('state2', function() {

    beforeEach(function() {
      browser.get('index.html#/state2');
    });


    it('should render state2 when user navigates to /state2', function() {
      expect(element.all(by.css('[ui-view] h1')).first().getText()).
        toMatch(/State 2/);
    });

  });
});
