let chapters = 1;
let chapterCount = 1;
let del = 0;
let collapse = true;

let chaptersToAdd = [];

for(const [key, value] of Object.entries(data)) {
  let regex = /(\D+)(\d+)/;
  let match = key.match(regex);
  if(match && match[2] != 1 && !chaptersToAdd.includes(parseInt(match[2]))) chaptersToAdd.push(parseInt(match[2]));
}

console.log("toAdd = " + chaptersToAdd);

chaptersToAdd.forEach((chapter) => {
  $("#accordionForm").append(`
    <div class="card">
      <div class="card-header" id="heading${chapter}">
        <div class="d-inline-flex justify-content-start">
          <button class="delchapter btn btn-outline-danger" id="del${chapter}" type="button">-</button>
          </div>
        <div class="d-inline-flex justify-content-center">
          <input class="form-control" id="name${chapter}" type="text" name="name${chapter}" placeholder="Chapter ${chapter}" 
            value="${data["name" + chapter]}" style="width:90%;" data-toggle="collapse" 
            data-target="#collapse${chapter}" aria-expanded="false" aria-controls="collapse${chapter}" />
        </div>
        <div class="d-inline-flex justify-content-end">
          <button class="addchapter btn btn-outline-primary" id="add${chapter}" type="button">+</button>
        </div>
      </div>
    <div class="collapse show" id="collapse${chapter}" aria-labelledby="heading${chapter}">
      <div class="card-body">
          <div class="form-group"><label for="size${chapter}">Wordcount/Runtime:</label><input class="form-control" id="size${chapter}" type="number" name="size${chapter}" placeholder="2500" value="${data["size" + chapter]}" /></div>
          <div class="form-group"><label for="characters${chapter}">Characters:</label>
          <input id="characters${chapter}" class="form-control" type="text" data-role="tagsinput" name="characters${chapter}" value="${data["characters" + chapter]}" />
      </div>
    </div>`);
    $("#characters" + chapter).tagsinput("refresh");
});

console.log(chaptersToAdd);
chaptersToAdd.push(1);
chapters = Math.max(...chaptersToAdd);
chapterCount = chaptersToAdd.length;

console.log(chapters + " no of chapters and count = " + chapterCount);

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
          <div class="form-group"><label for="characters${chapters}">Characters:</label>
          <input id="characters${chapters}" class="form-control" type="text" data-role="tagsinput" name="characters${chapters}" />
      </div>
    </div>`);
    $("#collapseall").html("Collapse All");
    collapse = true;
    $("#characters" + chapters).tagsinput("refresh");
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