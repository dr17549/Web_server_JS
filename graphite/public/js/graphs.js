let template = 01;
$(".newgraph").on("click", function (event) {
  let id = event.target.id;
  let match = /template([0-9]+)/.exec(id);
  template = match[1];
  $("#selectstory").modal("show");
});

$("#storyyes").click(function () {
  console.log(document.forms);
  document.forms[1].action += "/" + template;
  document.forms[1].submit();
});

$('[id^="edit"]').click(function () {
  let id = event.target.id;
  let match = /edit([0-9]+)/.exec(id);
  let graph_id = match[1];

  for (data in graph_data) {
    if (graph_data[data].graph_ID == graph_id) {
      console.log(graph_data[data]);
      document.getElementById("user_id").value = graph_data[data].user_ID;
      document.getElementById("story_id").value = graph_data[data].story_ID;
      document.getElementById("template_id").value =
        graph_data[data].template_ID;
      document.getElementById("graph_id").value = graph_data[data].graph_ID;
      document.getElementById("options").value = graph_data[data].options;
    }
  }
});
