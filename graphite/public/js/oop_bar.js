var bar = {
  draw: function (dataset) {
    d3.select("#linkStrength")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#LS_label")
      .style("display", "none")
      .style("invisbility", "hidden");

    var margin = { top: 40, right: 30, bottom: 30, left: 50 },
      width = 460 * 1.5 - margin.left - margin.right,
      height = 320 * 1.5 - margin.top - margin.bottom;

    var greyColor = "#898989";
    var barColor = d3.interpolateInferno(0.4);
    var highlightColor = d3.interpolateInferno(0.3);

    var formatPercent = d3.format(".0%");

    var svg = d3
      .select("#viz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand().range([0, width]).padding(0.4);
    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y).tickSize([]).tickPadding(10);

    x.domain(
      dataset.map((d) => {
        return d.chapter;
      })
    );
    y.domain([
      0,
      d3.max(dataset, (d) => {
        return d.value;
      }),
    ]);
    //axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Word Count");

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + 27) + ")"
      )
      .style("text-anchor", "middle")
      .text("Chapter");
    svg.append("g").attr("class", "y axis").call(yAxis);

    svg
      .selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .style("display", (d) => {
        return d.value === null ? "none" : null;
      })
      .style("fill", (d) => {
        return d.value ===
          d3.max(dataset, (d) => {
            return d.value;
          })
          ? highlightColor
          : barColor;
      })
      .attr("x", (d) => {
        return x(d.chapter);
      })
      .attr("width", x.bandwidth())
      .attr("y", (d) => {
        return height;
      })
      .attr("height", 0)
      .attr("y", (d) => {
        return y(d.value);
      })
      .attr("height", (d) => {
        return height - y(d.value);
      });

    svg
      .selectAll(".label")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .style("display", (d) => {
        return d.value === null ? "none" : null;
      })
      .attr("x", (d) => {
        return x(d.chapter) + x.bandwidth() / 2 - 8;
      })
      .style("fill", (d) => {
        return d.value ===
          d3.max(dataset, (d) => {
            return d.value;
          })
          ? highlightColor
          : greyColor;
      })
      .attr("y", (d) => {
        return height;
      })
      .attr("height", 0)
      .transition()
      .duration(750)
      .delay((d, i) => {
        return i * 150;
      })
      .text((d) => {
        return d.value;
      })
      .attr("y", (d) => {
        return y(d.value) + 0.1;
      })
      .attr("dy", "-.7em");

    if (options.colour) changeColor(options.colour);
  },
};

let get_bar_data = function (display_data) {
  let bar_data = [];
  if (display_data.wordcount && display_data.title) {
    for (const [key, value] of Object.entries(display_data)) {
      let regex = /^\d+$/;
      let match = key.match(regex);
      if (match) {
        bar_data.push({ chapter: key, value: value.size });
      }
    }
  }
  return bar_data;
};

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
