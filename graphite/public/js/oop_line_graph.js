var line_graph = {
  append: function (data) {
    d3.select("#colourSelect")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#LS_colour")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#linkStrength")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#LS_label")
      .style("display", "none")
      .style("invisbility", "hidden");

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valuelines = {};
    for (i in data["unique_characters"]) {
      valuelines[data["unique_characters"][i]] = d3
        .line()
        .x(function (d) {
          return x(d["Chapter"]);
        })
        .y(function (d) {
          return y(d[data["unique_characters"][i]]);
        });
    }
    console.log(valuelines);
    function handleMouseOver() {}

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
      console.log(original_data["max"]);

      svg
        .selectAll("mydots")
        .data(unique_characters)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
          if (i > 15) {
            return parseInt(i / 15) * 110 + 30;
          }
          return 30;
        })
        .attr("cy", function (d, i) {
          if (i > 15) {
            return 5 + (i % 15) * 25;
          }
          return 5 + i * 25;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .on("mouseover", function (d, i) {
          // select all other lines to
          d3.selectAll(".line").style("opacity", 0);
          d3.select("#" + unique_characters[i]).style("opacity", 10);
        })
        .style("fill", function (d, i) {
          return original_data["unique_colors"][i];
        });

      // Add one dot in the legend for each name.
      svg
        .selectAll("mylabels")
        .data(unique_characters)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
          if (i > 15) {
            return parseInt(i / 15) * 110 + 50;
          }
          return 50;
        })
        .attr("y", function (d, i) {
          if (i > 15) {
            return 5 + (i % 15) * 25;
          }
          return 5 + i * 25;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d, i) {
          return original_data["unique_colors"][i];
        })
        .text(function (d) {
          return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

      // format the data
      data.forEach(function (d) {
        d["Chapter"] = +d["Chapter"];
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
          return d["Chapter"];
        })
      );
      y.domain([0, original_data["max"]]);

      // Add the valueline path.
      for (i in unique_characters) {
        svg
          .append("path")
          .data([data])
          .attr("class", "line")
          .attr("id", unique_characters[i])
          .attr("d", valuelines[unique_characters[i]])
          .attr("fill", "none")
          .attr("stroke", original_data["unique_colors"][i])
          .attr("stroke-width", "2px");
      }
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // add the y Axis
      svg.append("g").call(d3.axisLeft(y));
      svg
        .append("text")
        .attr(
          "transform",
          "translate(" + width / 2 + " ," + (height + margin.top) + ")"
        )
        .style("text-anchor", "middle")
        .text("Chapter");
      // text label for the y axis
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Size");
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
