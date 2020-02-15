let chapters = 1;
let chapterCount = 1;
let del = 0;
let collapse = true;

$("#accordionForm").on("click", ".addchapter", function() {
    chapters++;
    chapterCount++;
    $("#accordionForm").append(`
    <div class="card">
      <div class="card-header" id="heading${chapters}">
        <div class="d-inline-flex justify-content-start">
          <button class="delchapter btn btn-outline-danger" id="del${chapters}" type="button">-</button>
          </div>
        <div class="d-inline-flex justify-content-center">
          <input class="form-control" id="name${chapters}" type="text" name="name${chapters}" placeholder="Chapter ${chapters}" 
            value="Chapter ${chapters}" style="width:90%;" data-toggle="collapse" 
            data-target="#collapse${chapters}" aria-expanded="false" aria-controls="collapse${chapters}" />
        </div>
        <div class="d-inline-flex justify-content-end">
          <button class="addchapter btn btn-outline-primary" id="add${chapters}" type="button">+</button>
        </div>
      </div>
    <div class="collapse show" id="collapse${chapters}" aria-labelledby="heading${chapters}">
      <div class="card-body">
          <div class="form-group"><label for="size${chapters}">Wordcount/Runtime:</label><input class="form-control" id="size${chapters}" type="number" name="size${chapters}" placeholder="2500" /></div>
          <div class="form-group"><label for="characters${chapters}">Characters:</label><textarea class="form-control" id="characters${chapters}" rows="3"></textarea></div>
      </div>
    </div>`);
});

$("#accordionForm").on("click", ".delchapter", function(event) {
  if(chapterCount > 1) {
    $('#delconfirm').modal('show');
    let id = event.target.id;
    let match = /del([0-9]+)/.exec(id);
    del = match[1];
  } else {
    $("#minchapter").modal();
  }
});

$("#delyes").click(function() {
  $("#del".concat(del)).closest(".card").remove();
  chapterCount--;
  //chapters--;
});

$("#collapseall").click(function(event) {
  if(collapse) {
    $(".card > .show").collapse('hide');
    $("#collapseall").html("Expand All");
    collapse = false;
  } else {
    $(".card > .collapse").collapse('show');
    $("#collapseall").html("Collapse All");
    collapse = true;
  }
});