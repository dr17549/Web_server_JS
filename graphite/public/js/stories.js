let story = -1;

window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
}, 2000);

$(".editbutton").on("click", function(event) {
    let id = $(event.target).closest('button')[0].id;
    let match = /edit([0-9]+)/.exec(id);
    let story = match[1];
    $("#ID").val(story);
    $("#function").val("edit");
    return true;
});

$(".deletebutton").on("click", function(event) {
    $('#delconfirm').modal('show');
    let id = $(event.target).closest('button')[0].id;
    let match = /del([0-9]+)/.exec(id);
    story = match[1];
    $("#ID").val(story);
    $("#function").val("delete");
});

$("#delyes").click(function() {
    document.forms[0].submit();
  });