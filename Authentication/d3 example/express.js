const express = require("express");
const app = express();
const port = 8000;
var path = require("path");
const d3 = require("d3");
app.use(express.static(path.join(__dirname, "static")));

app.set("view engine", "pug");

// app.get('/', (req, res) => res.send('Hello World!'))
app.get("/", function(req, res) {
  res.render("index", {
    title: "Hey",
    message: "Hello there!",
    paragraph: "I'm a paragraph"
  });
  res.sendFile(
    "/home/laetitia/Project/ChemAlive_Interface_Node/ChemAlive_Interface.html"
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
