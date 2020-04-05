let template = 01;

$(".newgraph").on("click", function(event) {
    let id = event.target.id;
    let match = /template([0-9]+)/.exec(id);
    template = match[1];
    $('#selectstory').modal('show');
});

$("#storyyes").click(function() {
    document.forms[0].action += "/" + template;
    document.forms[0].submit();
  });