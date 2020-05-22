var force_directed = {
  draw: function (graph, text_color, node_color) {
    // take out the axis

    d3.select("#xAxisTitle")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#xAxisLabel")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#yAxisTitle")
      .style("display", "none")
      .style("invisbility", "hidden");
    d3.select("#yAxisLabel")
      .style("display", "none")
      .style("invisbility", "hidden");
    // need this to map the js object to json
    var canvas = document.querySelector("canvas"),
      context = canvas.getContext("2d"),
      width = canvas.width,
      height = canvas.height;

    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(function (d) {
            return d.id;
          })
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));
    // .alphaDecay(0);
    // if (options.colour) changeColor(options.colour);
    d3.select("input[type=range]").on("input", inputted);

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    // // problem is here
    function ticked() {
      context.clearRect(0, 0, width, height);

      context.beginPath();
      graph.links.forEach(drawLink);
      context.strokeStyle = "#aaa";
      context.stroke();

      context.beginPath();
      graph.nodes.forEach(drawNode);
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.beginPath();
      graph.nodes.forEach(drawLabel);
    }

    function inputted() {
      simulation.force("link").strength(+this.value);
      simulation.alpha(1).restart();
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawLabel(d) {
      context.font = "15px Arial";
      context.fillStyle = text_color;
      context.fillText(d.id, d.x, d.y - 3);
      context.fill();
    }
    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.fillStyle = node_color;
      context.arc(d.x, d.y, 6, 0, 2 * Math.PI);
    }
  },
};
