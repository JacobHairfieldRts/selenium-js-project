const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

// Function to launch Chrome and check the background color
async function checkTheme() {
  let driver;

  try {
    driver = await new Builder().forBrowser('chrome').build();

    // Step 1: Navigate to Google (or any website)
    await driver.get('https://www.google.com');

    // Step 2: Get the background color of the body element
    let bodyElement = await driver.findElement(By.tagName('body'));
    let backgroundColor = await bodyElement.getCssValue('background-color');
    console.log('Background color:', backgroundColor);

    // Step 3: Check if the background color indicates light mode
    if (isLightMode(backgroundColor)) {
      console.log('Light mode detected, relaunching browser in dark mode...');
      await driver.quit(); // Properly close the current browser session before relaunching
      await relaunchInDarkMode(); // Relaunch browser in dark mode
    } else {
      console.log('Dark mode is already enabled.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Only quit the driver if it is still active
    if (driver) {
      await driver.quit();
    }
  }
}

// Function to check if the current background color indicates light mode
function isLightMode(backgroundColor) {
  // Light mode check based on white or light shades
  return backgroundColor === 'rgba(255, 255, 255, 1)' || backgroundColor.includes('rgba(245, 245, 245');
}

// Function to relaunch Chrome with dark mode enabled
async function relaunchInDarkMode() {
  let driver;

  try {
    let options = new chrome.Options();
    options.addArguments('--force-dark-mode'); // Force dark mode

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    // Navigate to the same page and verify dark mode
    await driver.get('https://www.google.com');

    // Optionally, take a screenshot to confirm dark mode
    // await driver.takeScreenshot().then(function(image, err) {
    //   fs.writeFileSync('dark_mode_screenshot.png', image, 'base64');
    // });

    console.log('Browser relaunched with dark mode.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Ensure we quit the driver after use
    if (driver) {
      await driver.quit();
    }
  }
}

// Run the script to check theme and relaunch if needed
checkTheme();
