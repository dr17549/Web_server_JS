const fs = require("fs");
describe("test google.com", () => {
  const { Builder, By, Key, until } = require("selenium-webdriver");
  var driver;

  beforeEach(() => {
    driver = new Builder().forBrowser("chrome").build();
  });

  afterEach(() => {
    driver.quit();
  });

  it("New Graph integration test", async () => {
    await driver.get("http://localhost:3000/");
    driver.getTitle().then((title) => {
      expect(title).toEqual("Graphite");
    });
    console.log("FIND BUTTON");
    await driver.wait(until.elementLocated(By.id("login")), 20000).click();
    driver.getTitle().then((title) => {
      expect(title).toEqual("Graphite");
    });
    console.log("Click button");
    console.log("Input Box");
    await driver.findElement(By.id("email")).sendKeys("test@test.com");
    await driver.findElement(By.id("pw")).sendKeys("abc123");
    await driver.findElement(By.id("submit_login")).click();
    console.log("Logged in");

    await driver.findElement(By.id("mygraphs")).click();
    await driver.findElement(By.id("list-force_directed-list")).click();
    await driver.findElement(By.id("template0")).click();
    await driver.findElement(By.id("storyyes")).click();

    console.log("End test");

    await driver.findElement(By.className("btn-success")).click();
    console.log("save graph");
    await driver.findElement(By.className("btn-outline-primary")).click();
    console.log("clicked edit ");
  });
});
