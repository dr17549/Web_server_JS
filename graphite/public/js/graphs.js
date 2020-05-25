let template = -1;
let graph = -1;

$(".newgraph").on("click", function (event) {
  let id = $(event.target).closest('a')[0].id;
  let match = /template([0-9]+)/.exec(id);
  template = match[1];
  $("#template_ID").val(template);
  $("#selectstory").modal("show");
});

$("#storyyes").click(function () {
  document.getElementById("new_graph").submit();
});

$(".editbutton").on("click", function(event) {
  let id = $(event.target).closest('button')[0].id;
  let match = /edit([0-9]+)/.exec(id);
  graph = match[1];
  $("#ID").val(graph);
  $("#function").val("edit");
  return true;
});

$(".deletebutton").on("click", function(event) {
  $('#delconfirm').modal('show');
  let id = $(event.target).closest('button')[0].id;
  let match = /del([0-9]+)/.exec(id);
  graph = match[1];
  $("#ID").val(graph);
  $("#function").val("delete");
});

$("#delyes").click(function() {
  document.forms[0].submit();
});

window.setTimeout(function() {
  $(".alert").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove(); 
  });
}, 2000);