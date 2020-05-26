var force_directed = {
  draw: function (graph, text_color, node_color) {
    // take out the axis

    d3.select("#xAxisTitle")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#xAxisLabel")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#yAxisTitle")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#yAxisLabel")
      .style("display", "none")
      .style("invisbility", "hidden");
    
    // need this to map the js object to json
    var canvas = document.querySelector("canvas"),
      context = canvas.getContext("2d"),
      width = canvas.width,
      height = canvas.height;

    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(function (d) {
            return d.id;
          })
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
    // .alphaDecay(0);
    // if (options.colour) changeColor(options.colour);
    d3.select("input[type=range]").on("input", inputted);

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    // // problem is here
    function ticked() {
      context.clearRect(0, 0, width, height);

      context.beginPath();
      graph.links.forEach(drawLink);
      context.strokeStyle = "#aaa";
      context.stroke();

      context.beginPath();
      graph.nodes.forEach(drawNode);
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.beginPath();
      graph.nodes.forEach(drawLabel);
    }

    function inputted() {
      simulation.force("link").strength(+this.value);
      simulation.alpha(1).restart();
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawLabel(d) {
      context.font = "15px Arial";
      context.fillStyle = text_color;
      context.fillText(d.id, d.x, d.y - 3);
      context.fill();
    }
    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.fillStyle = node_color;
      context.arc(d.x, d.y, 6, 0, 2 * Math.PI);
    }
  },
};

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

let force_change_color = function(color, force_data) {
  if (color.localeCompare("random") == 0) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const set_color = "#" + randomColor;
    const randomNodeColor = Math.floor(Math.random() * 16777215).toString(16);
    const nodeColor = "#" + randomNodeColor;
    force_directed.draw(force_data, set_color, nodeColor);
  }
  if (color.localeCompare("green") == 0) {
    force_directed.draw(force_data, "Green", "LimeGreen");
  }
  if (color.localeCompare("red") == 0) {
    force_directed.draw(force_data, "Red", "LightCoral");
  }
  if (color.localeCompare("blue") == 0) {
    force_directed.draw(force_data, "Blue", "Aqua");
  }
};