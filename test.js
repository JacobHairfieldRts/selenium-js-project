const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
  // Initialize WebDriver for Chrome
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to a sample page (Google in this case)
    await driver.get('https://www.google.com');

    // Find the search box using its name attribute and enter text
    await driver.findElement(By.name('q')).sendKeys('Selenium WebDriver', Key.RETURN);

    // Wait for the page title to contain 'Selenium WebDriver'
    await driver.wait(until.titleContains('Selenium WebDriver'), 5000);

    console.log('Test passed: Selenium WebDriver searched successfully!');
  } finally {
    // Quit the browser
    await driver.quit();
  }
})();
