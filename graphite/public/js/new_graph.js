// svg options
var width = 960;
var height = 600;

// graph options
let options = graph.options ? JSON.parse(graph.options) : {};

if (options.colour) {
  $("#colourSelect").val(options.colour);
}

$("#colourSelect").on("change", function () {
  console.log("changing to " + $("#colourSelect").val());
  changeColor($("#colourSelect").val());
});

// main function
var display_data = JSON.parse(data);

// draw the corresponding graphs

if (template.name == "bar") {
  let bar_data = get_bar_data(display_data);
  bar.draw(bar_data);
  if (options.colour) changeColor(options.colour);
}

if (template.name == "tree") {
  let tree_data = get_tree_data(display_data);
  console.log(tree_data);
  collapse_tree.draw(tree_data);
}

if (template.name == "appearance") {
  let hoz_data = get_appearance_data(display_data);
  horizontal_bar.draw(hoz_data);
  if (options.colour) changeColor(options.colour);
}

// force_data needs to be outside the if statement as the colour change function relies upon it
let force_data = get_force_directed_data(display_data);
if (template.name == "force_directed") {
  force_directed.draw(force_data, "Black", "Black");
  if (options.colour) changeColor(options.colour);

  // template fix - e.g. removed canvas if use SVG and vice versa
  var viz = document.querySelector("#viz");
  viz.style.display = "none";
}

if (template.name == "line") {
  var line_data = get_lined_data(display_data);
  line_graph.append(line_data);
}

// change colors
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
    force_change_color(color, force_data);
  }
}
