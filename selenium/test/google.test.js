const fs = require("fs");
jest.setTimeout(30000);

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
    // driver.getTitle().then((title) => {
    //   expect(title).toEqual("Graphite");
    // });
    console.log("FIND BUTTON");
    await driver.wait(until.elementLocated(By.id("login")), 20000).click();
    driver.getTitle().then((title) => {
      expect(title).toEqual("Graphite");
    });
    console.log("Click button");
    // test login 
    console.log("Input Box");
    await driver.findElement(By.id("email")).sendKeys("test@test.com");
    await driver.findElement(By.id("pw")).sendKeys("testtest");
    await driver.findElement(By.id("submit_login")).click();
    console.log("Logged in");

    // test initi new graph and save graph
    await driver.wait(until.elementLocated(By.id("mygraphs")), 20000).click();
    console.log("finding bar graphs")
    // await driver.findElement(By.id("mygraphs")).click();
    await driver.wait(until.elementLocated(By.id("list-bar-list")), 20000).click();
    console.log("Find correct template")
    await driver.wait(until.elementLocated(By.className("newgraph")), 20000).click();
    console.log("Find correct template")
    // await driver.wait(until.elementLocated(By.id("storyyes")), 20000).click();
    await driver.findElement(By.id("storyyes")).click();
    console.log("Continue to graph")
    await driver.wait(until.elementLocated(By.className("btn-success")), 20000).click();
    // await driver.findElement(By.id("list-bar-list")).click();
    // await driver.findElement(By.id("template1")).click();
    // await driver.findElement(By.id("storyyes")).click();
    // await driver.findElement(By.className("btn-success")).click();
    console.log("save graph");
    //test edit graph 
    await driver.findElement(By.className("btn-outline-primary")).click();
    console.log("clicked edit ");
    // test edit color 
    console.log("clicked change color");
    await driver.findElement(By.xpath('//*[@id="colourSelect"]/option[2]')).click();
    // save graph 
    console.log("Check for success");
    await driver.findElement(By.className("btn-success")).click();
    await driver.findElement(By.id("mygraphs")).click();
    // log out 
    console.log("Log out");
    await driver.findElement(By.id("logout_button")).click(); 
    console.log("Test end"); 
    driver.quit();
  });
});
