const selenium = require('selenium-webdriver');
const driver = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build();
const until = selenium.until;
const By = selenium.By;

function exitHandler(options, err) {
    driver.quit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

until.elementNotLocated = function(locator) {
  return new until.Condition('element to be located by ' + locator,
      function(driver) {
        return driver.findElements(locator).then(function(elements) {
          return !elements[0];
        });
      });
};

const timerPopupElement = By.css('.countdownPopup .timeDisplay');

function waitForCountDownToStart() {
    driver.wait(
        until.elementLocated(timerPopupElement),
        600000
    ).then(waitForCountDownToEnd);
}

function waitForCountDownToEnd() {
    driver.wait(
        until.elementNotLocated(timerPopupElement),
        600000
    ).then(readTextToBeTyped);
}

function readTextToBeTyped() {
    const lblFullText = driver.findElement(By.css('.gameView > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div'));

    lblFullText.getText().then(startTyping);

    waitForCountDownToStart();
}

function startTyping(text) {
    const txtInput = driver.findElement(By.className('txtInput'));

    console.log('Need to type - "' + text + '"');

    (text + ' ').split('').forEach(letter => {
        driver.sleep(85);
        txtInput.sendKeys(letter);
    });
}

driver.get("http://play.typeracer.com/");

waitForCountDownToStart();
