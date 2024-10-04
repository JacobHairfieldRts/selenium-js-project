const { Builder, By, until } = require('selenium-webdriver');
const nodemailer = require('nodemailer');
require('dotenv').config();  // Import dotenv and load the environment variables

// Configure Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,           // Use email from .env
    pass: process.env.EMAIL_PASSWORD,       // Use email password from .env
  }
});

// Login function to handle the entire process
async function loginToApplication(driver, loginUrl, username, password) {
  try {
    // Navigate to the login page
    await driver.get(loginUrl);

    // Locate and click the login button
    await clickLoginButton(driver);

    // Fill out the username and password fields
    await enterCredentials(driver, username, password);

    // Submit the login form
    await submitLoginForm(driver);

    console.log('Login process completed successfully.');

    // Call the function to send an email notification with a message
    await sendEmailNotification('Your Selenium test is making progress');

  } catch (error) {
    console.error('Error during login:', error);
  }
}

// Helper function to click the login button
async function clickLoginButton(driver) {
  const loginButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Login')]")), 5000);
  await loginButton.click();
}

// Helper function to enter the username and password
async function enterCredentials(driver, username, password) {
  const usernameField = await driver.wait(until.elementLocated(By.id('username-login')), 5000);
  await usernameField.sendKeys(username);

  const passwordField = await driver.wait(until.elementLocated(By.id('password-login')), 5000);
  await passwordField.sendKeys(password);
}

// Helper function to submit the login form
async function submitLoginForm(driver) {
  const submitButton = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 5000);
  await submitButton.click();
}

// Helper function to send email notification
async function sendEmailNotification(message) {
  let mailOptions = {
    from: process.env.EMAIL_USER,          // Use sender's email from .env
    to: process.env.EMAIL_RECIPIENT,       // Use recipient's email from .env
    subject: 'Test Status: Selenium Progress',
    text: message                          // Message body
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Main function to initialize WebDriver and run the login function
(async function main() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Fetch sensitive information from the .env file
    const loginUrl = process.env.SELENIUM_LOGIN_URL;
    const username = process.env.SELENIUM_USERNAME;
    const password = process.env.SELENIUM_PASSWORD;

    // Call the login function to perform the login
    await loginToApplication(driver, loginUrl, username, password);

  } finally {
    await driver.quit();
  }
})();
