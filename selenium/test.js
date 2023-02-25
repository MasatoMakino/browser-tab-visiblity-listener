const { Builder, Capabilities, By } = require("selenium-webdriver");
const { Preferences, Type, Level } = require("selenium-webdriver/lib/logging");
const pref = new Preferences();
pref.setLevel(Type.BROWSER, Level.ALL);

const TAB_INTERVAL = 300;

const testSwitchTab = async (driver) => {
  try {
    await driver.get("http://localhost:3005/demo.html");
    const browserWindow = await driver.manage().window();
    await browserWindow.minimize();
    await searchLog(driver, "invisible");
    await browserWindow.maximize();
    await searchLog(driver, "visible");
  } catch (e) {
    console.log(e);
  } finally {
    driver && (await driver.quit());
  }
};

const searchLog = async (driver, message) => {
  const state = await driver.executeScript("return window.visibleState");
  if (state != message) {
    const cap = await driver.getCapabilities();
    console.warn(
      `${cap.map_.get("browserName")}:${cap.map_.get(
        "browserVersion"
      )} => expected is ${message} but result is ${state}`
    );
    process.exit(1);
  }
};

const test = (capabilities) => {
  capabilities.setLoggingPrefs(pref);
  const driver = new Builder().withCapabilities(capabilities).build();
  testSwitchTab(driver);
};

const browsers = [
  Capabilities.chrome(),
  Capabilities.firefox(),
  Capabilities.safari(),
];

browsers.forEach(async (capability) => {
  await test(capability);
});
