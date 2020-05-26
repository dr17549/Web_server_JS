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
}

if (template.name == "tree") {
  let tree_data = get_tree_data(display_data);
  console.log(tree_data);
  collapse_tree.draw(tree_data);
}

if (template.name == "appearance") {
  let hoz_data = get_appearance_data(display_data);
  horizontal_bar.draw(hoz_data);
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

// generates a random int
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generates a random colour
let randomColor = (function () {
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
