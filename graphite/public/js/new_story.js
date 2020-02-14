let chapters = 1;

$("#accordionForm").on("click", ".addchapter", function() {
    chapters++;
    $("#accordionForm").append(`<div class="card">
    <div class="card-header" id="heading${chapters}">
      <h2 class="mb-0">
        <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse${chapters}" aria-expanded="false" aria-controls="collapse${chapters}">
          Chapter ${chapters}
        </button>
      </h2>
    </div>
    <div id="collapse${chapters}" class="collapse" aria-labelledby="heading${chapters}" data-parent="#accordionForm">
      <div class="card-body">
        <div class="form-group">
            <label for="name${chapters}">Chapter Name:</label>
            <input class="form-control" id="name${chapters}" type="text" name="name${chapters}" placeholder="Chapter ${chapters}" />
        </div>
        <div class="form-group">
            <label for="size${chapters}">Wordcount/Runtime:</label>
            <input class="form-control" id="size${chapters}" type="number" name="size${chapters}" placeholder="2500" />
        </div>
        <div class="form-group">
            <label for="characters${chapters}">Characters:</label>
            <textarea class="form-control" id="characters${chapters}" rows="3"></textarea>
        </div>
        <button class="delchapter btn btn-outline-danger" id="del${chapters}" type="button" style="margin-right:0.5em">-</button>
        <button class="addchapter btn btn-outline-primary" id="add${chapters}" type="button">+</button>
      </div>
    </div>
    </div>`);
});