let options = graph.options ? JSON.parse(graph.options) : {};
if(options.colour) $("#colourSelect").val(options.colour);

$('#colourSelect').on('change', function() {
  console.log("changing to " + $("#colourSelect").val());
  changeColor($("#colourSelect").val());
});

// main function
var dataset = [];

var display_data = JSON.parse(data);
var keys = Object.keys(display_data);

for (key in keys) {
  if (
    "wordcount".localeCompare(keys[key]) != 0 &&
    "title".localeCompare(keys[key]) != 0
  ) {
    var single = {
      chapter: key,
      value: display_data[parseInt(keys[key])]["size"],
    };
    dataset.push(single);
  }
}

if(template.name == "bar") bar.draw(dataset);
