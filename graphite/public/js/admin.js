let user = -1;

window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
}, 2000);

$(".deletebutton").on("click", function(event) {
    $('#delconfirm').modal('show');
    let id = $(event.target).closest('button')[0].id;
    let match = /del([0-9]+)/.exec(id);
    user = match[1];
});

$(".editbutton").on("click", function(event) {
    let id = $(event.target).closest('button')[0].id;
    let match = /edit([0-9]+)/.exec(id);
    user = match[1];
    let userData = findData(user);
    $("#ID").val(userData.user_ID);
    $("#email").val(userData.email);
    $("#access").val(userData.access);

    $('#editform').modal('show');
});

$("#edityes").click(function() {
    document.forms[1].submit();
  });

$("#delyes").click(function() {
    document.forms[0].action += '/delete/' + user;
    document.forms[0].submit();
  });

let findData = function(ID) {
    let userData = {};
    data.forEach((val) => {if(val.user_ID.toString() == user) userData = val});
    return userData;
};