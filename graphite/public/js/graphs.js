let template = -1;

$(".newgraph").on("click", function (event) {
  let id = event.target.id;
  let match = /template([0-9]+)/.exec(id);
  template = match[1];
  $("#selectstory").modal("show");
});

$("#storyyes").click(function () {
  document.getElementById("new_graph").action += "/" + template;
  document.getElementById("new_graph").submit();
  // document.forms[1].action += "/" + template;
  // document.forms[1].submit();
});

$(".editbutton").on("click", function(event) {
  let id = event.target.id;
  let match = /edit([0-9]+)/.exec(id);
  let story = match[1];
  document.forms[0].action += '/edit/' + story;
  return true;
});

$(".deletebutton").on("click", function(event) {
  $('#delconfirm').modal('show');
  let id = event.target.id;
  let match = /del([0-9]+)/.exec(id);
  story = match[1];
});

$("#delyes").click(function() {
  document.forms[0].action += '/delete/' + story;
  document.forms[0].submit();
});

window.setTimeout(function() {
  $(".alert").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove(); 
  });
}, 2000);