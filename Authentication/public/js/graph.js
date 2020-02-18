//d3 checking
d3.select("p").style("color", "green");

// http://localhost:3000/static/json/mock.json
var data = d3.json("/json/data.json", function(data) {
  return data;
});

data.then(function(d) {
  // need this to map the js object to json
  d.forEach(function(ele) {
    ele.Letter = ele.Letter;
    ele.Freq = ele.Freq;
  });

  //   console.log(d.title);
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(d)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return x(d.bonus);
    })
    .attr("cy", function(d) {
      return y(d.age);
    })
    .attr("r", 15)
    .style("fill", "#69b3a2");
});

console.log(d3.version);
