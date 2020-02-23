// http://localhost:3000/static/json/mock.json
var data = d3.json("/json/miserables.json", function(data) {
  return data;
});

data.then(function(inner_data) {
  // need this to map the js object to json

  inner_data.nodes.forEach(function(ele) {
    ele.id = ele.id;
    ele.group = ele.group;
  });
  inner_data.links.forEach(function(ele) {
    ele.source = ele.source;
    ele.target = ele.target;
    ele.value = ele.value;
  });

  var svg = d3.select("#viz"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var color = d3.scaleOrdinal(d3.schemeAccent);

  var simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id(function(d) {
        return d.id;
      })
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));
  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(inner_data.links)
    .enter()
    .append("line")
    .attr("stroke-width", function(d) {
      return Math.sqrt(d.value);
    });

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(inner_data.nodes)
    .enter()
    .append("g");

  var circles = node
    .append("circle")
    .attr("r", 5)
    .attr("fill", function(d) {
      return color(d.group);
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  var lables = node
    .append("text")
    .text(function(d) {
      return d.id;
    })
    .attr("x", 6)
    .attr("y", 3);

  node.append("title").text(function(d) {
    return d.id;
  });

  simulation.nodes(inner_data.nodes).on("tick", ticked);

  simulation.force("link").links(inner_data.links);

  function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});

console.log(d3.version);
