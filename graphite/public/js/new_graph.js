let options = graph.options ? JSON.parse(graph.options) : {};
if (options.colour) {
  $("#colourSelect").val(options.colour);
}

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

// fake data
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

var line_data = {
  Afghanistan: [
    {
      Date: 1999,
      Imports: "15",
      Exports: "20",
    },
    {
      Date: 2008,
      Imports: "42",
      Exports: "115",
    },
    {
      Date: 2007,
      Imports: "29",
      Exports: "79",
    },
    {
      Date: 2009,
      Imports: "346",
      Exports: "324",
    },
    {
      Date: 2006,
      Imports: "44",
      Exports: "69",
    },
    {
      Date: 2010,
      Imports: "424",
      Exports: "503",
    },
    {
      Date: 2005,
      Imports: "28",
      Exports: "48",
    },
    {
      Date: 2011,
      Imports: "413",
      Exports: "603",
    },
    {
      Date: 2004,
      Imports: "34",
      Exports: "41",
    },
    {
      Date: 2012,
      Imports: "313",
      Exports: "517",
    },
    {
      Date: 2003,
      Imports: "21",
      Exports: "36",
    },
    {
      Date: 2013,
      Imports: "513",
      Exports: "615",
    },
    {
      Date: 2002,
      Imports: "18",
      Exports: "23",
    },
    {
      Date: 2014,
      Imports: "471",
      Exports: "766",
    },
    {
      Date: 2001,
      Imports: "17",
      Exports: "29",
    },
    {
      Date: 2015,
      Imports: "119",
      Exports: "181",
    },
    {
      Date: 2000,
      Imports: "25",
      Exports: "25",
    },
  ],
};

var hoz_data = get_appearance_data(display_data);
var f_d = get_force_directed_data(display_data);

// console.log(display_data);
if (template.name == "bar") bar.draw(dataset);
if (template.name == "tree") collapse_tree.draw(treeData);
if (template.name == "appearance") horizontal_bar.draw(hoz_data);
if (template.name == "force_directed") {
  force_directed.draw(f_d, "Black", "Black");
  if (options.colour) changeColor(options.colour);
}
if (template.name == "line") {
  console.log("LINE GRAPH");
  line_graph.append(line_data);
}

// template fix - e.g. removed canvas if use SVG and vice versa
if (template.name == "force_directed") {
  var viz = document.querySelector("#viz");
  viz.style.display = "none";
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
              dataset[i]["value"] = 1;
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
  return dataset;
}

function changeColor(color) {
  if (template.name == "bar") {
    bar_change_color(color, "rect");
  }
  if (template.name == "appearance") {
    bar_change_color(color, "rect");
  }
  if (template.name == "line") {
    console.log("Change line colours");
    line_change_color(color, ".line");
  }
  if (template.name == "force_directed") {
    console.log("COLOR : template force directed");
    if (color.localeCompare("random") == 0) {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      const set_color = "#" + randomColor;
      const randomNodeColor = Math.floor(Math.random() * 16777215).toString(16);
      const nodeColor = "#" + randomNodeColor;
      force_directed.draw(f_d, set_color, nodeColor);
    }
    if (color.localeCompare("green") == 0) {
      force_directed.draw(f_d, "Green", "LimeGreen");
    }
    if (color.localeCompare("red") == 0) {
      force_directed.draw(f_d, "Red", "LightCoral");
    }
    if (color.localeCompare("blue") == 0) {
      force_directed.draw(f_d, "Blue", "Aqua");
    }
  }
}

function line_change_color(color, select) {
  //document.getElementById("save_color").value = color;
  var chosen;
  if (color.localeCompare("blue") == 0) {
    d3.selectAll(select)
      .transition()
      .duration(2000)
      .attr("stroke", function (d) {
        return d3.color(
          d3.rgb(
            getRndInteger(0, 40),
            getRndInteger(0, 40),
            getRndInteger(20, 230)
          )
        );
      });
  } else if (color.localeCompare("red") == 0) {
    d3.selectAll(select)
      .transition()
      .duration(2000)
      .attr("stroke", function (d) {
        return d3.color(
          d3.rgb(
            getRndInteger(20, 240),
            getRndInteger(0, 40),
            getRndInteger(0, 40)
          )
        );
      });
  } else if (color.localeCompare("green") == 0) {
    d3.selectAll(select)
      .transition()
      .duration(2000)
      .attr("stroke", function (d) {
        return d3.color(
          d3.rgb(
            getRndInteger(0, 40),
            getRndInteger(20, 240),
            getRndInteger(0, 40)
          )
        );
      });
  } else {
    console.log("random");
    d3.selectAll(select)
      .transition()
      .duration(2000)
      .attr("stroke", randomColor);
  }
}

function bar_change_color(color, select) {
  //document.getElementById("save_color").value = color;
  var chosen;
  if (color.localeCompare("blue") == 0) {
    d3.selectAll(select)
      .transition()
      .duration(2000)
      .style("fill", function (d) {
        return d3.color(
          d3.rgb(
            getRndInteger(0, 40),
            getRndInteger(0, 40),
            getRndInteger(20, 230)
          )
        );
      });
  } else if (color.localeCompare("red") == 0) {
    d3.selectAll(select)
      .transition()
      .duration(2000)
      .style("fill", function (d) {
        return d3.color(
          d3.rgb(
            getRndInteger(20, 240),
            getRndInteger(0, 40),
            getRndInteger(0, 40)
          )
        );
      });
  } else if (color.localeCompare("green") == 0) {
    d3.selectAll(select)
      .transition()
      .duration(2000)
      .style("fill", function (d) {
        return d3.color(
          d3.rgb(
            getRndInteger(0, 40),
            getRndInteger(20, 240),
            getRndInteger(0, 40)
          )
        );
      });
  } else {
    console.log("random");
    d3.selectAll(select).transition().duration(2000).style("fill", randomColor);
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var randomColor = (function () {
  var golden_ratio_conjugate = 0.618033988749895;
  var h = Math.random();

  var hslToRgb = function (h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return (
      "#" +
      Math.round(r * 255).toString(16) +
      Math.round(g * 255).toString(16) +
      Math.round(b * 255).toString(16)
    );
  };

  return function () {
    h += golden_ratio_conjugate;
    h %= 1;
    return hslToRgb(h, 0.5, 0.6);
  };
})();
