var initBarGraph = {
  draw: function (data) {

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
    // y.domain([0, d3.max(dataset,  d => { return d.value; })]);
    y.domain([0, 10]);
    //axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Size");

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
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
      // .transition()
      // .duration(750)
      // .delay(function (d, i) {
      //   return i * 150;
      // })
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

    console.log(color_options);
    changeColor(color_options);
  },
};
// has to change
function changeColor(color) {
  document.getElementById("save_color").value = color;
  var chosen;
  if (color.localeCompare("blue") == 0) {
    d3.selectAll("rect")
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
    d3.selectAll("rect")
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
    d3.selectAll("rect")
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
    d3.selectAll("rect").transition().duration(2000).style("fill", randomColor);
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

// main function
var dataset = [];

var display_data = JSON.parse(json_data);
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
initBarGraph.draw(dataset);
