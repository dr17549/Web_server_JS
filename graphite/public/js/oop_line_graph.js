var line_graph = {
  append: function (data) {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valuelines = {};
    for (i in data["unique_characters"]) {
      valuelines[data["unique_characters"][i]] = d3
        .line()
        .x(function (d) {
          return x(d['Chapter']);
        })
        .y(function (d) {
          return y(d[data["unique_characters"][i]]);
        });
    }

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("#viz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function draw(original_data) {
      var unique_characters = original_data["unique_characters"];
      var data = original_data["dataset"];

      // format the data
      data.forEach(function (d) {
        d['Chapter'] = +d['Chapter'];
        for (i in unique_characters) {
          d[unique_characters[i]] = +d[unique_characters[i]];
        }
      });
      console.log(data);

      // sort years ascending
      data.sort(function (a, b) {
        return a["Chapter"] - b["Chapter"];
      });

      // Scale the range of the data
      x.domain(
        d3.extent(data, function (d) {
          return d['Chapter'];
        })
      );
      y.domain([0, original_data["max"]]);

      // Add the valueline path.
      // for (i in unique_characters) {
      //   svg
      //     .append("path")
      //     .data([data])
      //     .attr("class", "line")
      //     .attr("d", valuelines[unique_characters[i]])
      //     .attr("fill", "none")
      //     .attr("stroke", "blue")
      //     .attr("stroke-width", "2px");
      // }
      svg
        .append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valuelines["Luke"])
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", "2px");
      // Add the valueline path.
      // svg
      //   .append("path")
      //   .data([data])
      //   .attr("class", "line")
      //   .attr("d", valueline2)
      //   .attr("fill", "none")
      //   .attr("stroke", "blue")
      //   .attr("stroke-width", "2px");
      // Add the X Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g").call(d3.axisLeft(y));
    }
    // trigger render
    draw(data);

    d3.select("input[type=range]").on("input", inputted);

    function inputted() {
      console.log("Select width");
      var val = +this.value + 2;
      if (val < 2) {
        val = 1;
      }
      var width = val.toString() + "px";
      console.log(width);
      d3.selectAll(".line").attr("stroke-width", width);
    }
  },
};
