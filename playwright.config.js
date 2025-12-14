// playwright.config.js (or similar)
const config = {
  // ... other config ...
  use: {
    // Set the base URL for tests
    baseURL: 'https://capstone-481123.ue.r.appspot.com', 
    // Recommended to run tests in headless mode (no browser window opens)
    headless: true,
  },
};
module.exports = config;