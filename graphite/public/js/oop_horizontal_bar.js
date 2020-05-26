var horizontal_bar = {
  draw: function (data) {
    d3.select("#linkStrength")
    .style("display", "none")
    .style("invisbility", "hidden");
    
    console.log(data);
    var margin = { top: 20, right: 20, bottom: 60, left: 60 },
      width = 920 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand().range([height, 0]).padding(0.1);

    var x = d3.scaleLinear().range([0, width]);
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("#viz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function (d) {
      d.value = +d.value;
    });

    // Scale the range of the data in the domains
    x.domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      }),
    ]);
    y.domain(
      data.map(function (d) {
        return d.character;
      })
    );
    //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // append the rectangles for the bar chart
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      //.attr("x", function(d) { return x(d.sales); })
      .attr("width", function (d) {
        return x(d.value);
      })
      .attr("y", function (d) {
        return y(d.character);
      })
      .attr("height", y.bandwidth());

    // add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));

    //append x axis
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.bottom - 10) + ")"
      )
      .style("font-size", "18px")
      .style("text-anchor", "middle")
      .text("Appearance across chapter");
    if (options.colour) changeColor(options.colour);
  },
};
