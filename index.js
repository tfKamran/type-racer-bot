const selenium = require('selenium-webdriver');
const until = selenium.until;
const By = selenium.By;

const driver = new selenium.Builder()
      .withCapabilities(selenium.Capabilities.chrome())
      .build();

function exitHandler(options, err) {
    driver.quit();
}

// Do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// Catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// Catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// Catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

until.elementNotLocated = locator =>
    new until.Condition('element to be located by ' + locator,
                        driver => driver.findElements(locator).then(elements => !elements[0]));

const timerPopupElement = By.css('.countdownPopup .timeDisplay');

function waitForCountDownToStart () {
    driver.wait(
        until.elementLocated(timerPopupElement),
        600000
    ).then(waitForCountDownToEnd);
}

function waitForCountDownToEnd () {
    driver.wait(
        until.elementNotLocated(timerPopupElement),
        600000
    ).then(readTextToBeTyped);
}

function readTextToBeTyped () {
    const lblFullText = driver.findElement(By.css('.gameView > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div'));

    lblFullText.getText().then(startTyping);

    waitForCountDownToStart();
}

function startTyping (text) {
    const txtInput = driver.findElement(By.className('txtInput'));

    console.log('Need to type - "' + text + '"');

    (text + ' ').split('').forEach(letter => {
        driver.sleep(85);
        txtInput.sendKeys(letter);
    });
}

driver.get("http://play.typeracer.com/");

waitForCountDownToStart();
