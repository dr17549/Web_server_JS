let options = graph.options ? JSON.parse(graph.options) : {};
if (options.colour) $("#colourSelect").val(options.colour);

$("#colourSelect").on("change", function () {
  console.log("changing to " + $("#colourSelect").val());
  changeColor($("#colourSelect").val());
});

// main function
var dataset = [];

var display_data = JSON.parse(data);

if (display_data.wordcount && display_data.title) {
  for (const [key, value] of Object.entries(display_data)) {
    let regex = /^\d+$/;
    let match = key.match(regex);
    if (match) {
      dataset.push({ chapter: key, value: value.size });
    }
  }
}

// for (key in keys) {
//   if (
//     "wordcount".localeCompare(keys[key]) != 0 &&
//     "title".localeCompare(keys[key]) != 0
//   ) {
//     var single = {
//       chapter: key,
//       value: display_data[parseInt(keys[key])]["size"],
//     };
//     dataset.push(single);
//   }
// }
var treeData = {
  name: "Top Level",
  children: [
    {
      name: "Level 2: A",
      children: [{ name: "Son of A" }, { name: "Daughter of A" }],
    },
    { name: "Level 2: B" },
  ],
};

var hoz_data = get_appearance_data(display_data);
var f_d = get_force_directed_data(display_data);

// console.log(display_data);
if (template.name == "bar") bar.draw(dataset);
if (template.name == "tree") collapse_tree.draw(treeData);
if (template.name == "appearance") horizontal_bar.draw(hoz_data);
if (template.name == "force_directed") force_directed.draw(f_d);

if (template.name != "force_directed") {
  var canvas = document.querySelector("canvas");
  canvas.style.display = "none";
}

function get_appearance_data(data) {
  var dataset = [];
  // console.log(display_data);
  if (display_data.wordcount && display_data.title) {
    for (const [key, value] of Object.entries(display_data)) {
      if (value.characters != undefined) {
        if (value.characters.length > 0) {
          list = value.characters.split(",");
          list.forEach(function (element) {
            element = element.trim();
            found = false;
            for (var i = 0; i < dataset.length; i++) {
              if (dataset[i]["character"] == element) {
                found = true;
                dataset[i]["value"] += 1;
              }
            }
            if (found == false) {
              dataset[i] = {};
              dataset[i]["character"] = element;
              dataset[i]["group"] = key;
            }
          });
        }
      }
    }
  }
  return dataset;
}

function get_force_directed_data(data) {
  var dataset = {};
  dataset["links"] = [];
  dataset["nodes"] = [];
  // set data
  if (display_data.wordcount && display_data.title) {
    for (const [key, value] of Object.entries(display_data)) {
      if (value.characters != undefined) {
        if (value.characters.length > 0) {
          list = value.characters.split(",");
          list.forEach(function (element) {
            element = element.trim();
            found = false;
            for (var i = 0; i < dataset["nodes"].length; i++) {
              if (dataset["nodes"][i]["id"] == element) {
                found = true;
              }
            }
            if (found == false) {
              dataset["nodes"][i] = {};
              dataset["nodes"][i]["id"] = element;
              dataset["nodes"][i]["group"] = key;
            }
          });
        }
      }
    }
  }
  var max = 0;
  if (display_data.wordcount && display_data.title) {
    // for each chapter
    for (const [key, value] of Object.entries(display_data)) {
      if (value.characters != undefined) {
        if (value.characters.length > 0) {
          list = value.characters.split(",");
          list.forEach(function (element) {
            element = element.trim();
            list.forEach(function (target) {
              target = target.trim();
              if (target.localeCompare(element) != 0) {
                found = false;
                for (var i = 0; i < dataset["links"].length; i++) {
                  if (
                    (dataset["links"][i]["source"] == element &&
                      dataset["links"][i]["target"] == target) ||
                    (dataset["links"][i]["source"] == target &&
                      dataset["links"][i]["target"] == element)
                  ) {
                    found = true;
                    dataset["links"][i]["value"] += 1;
                    if (dataset["links"][i]["value"] > max) {
                      max = dataset["links"][i]["value"];
                    }
                  }
                }
                if (found == false) {
                  dataset["links"][i] = {};
                  dataset["links"][i]["source"] = element;
                  dataset["links"][i]["target"] = target;
                  dataset["links"][i]["value"] = 1;
                }
              }
            });
          });
        }
      }
    }
  }
  for (var i = 0; i < dataset["links"].length; i++) {
    dataset["links"][i]["value"] = max + 1 - dataset["links"][i]["value"];
  }
  console.log(dataset);
  return dataset;
}
