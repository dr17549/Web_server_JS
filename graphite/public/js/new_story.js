// drag and drop events for the levels
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

// row and column ids are used to figure out which level has been dropped into
function drop(ev) {
  let match = /row([0-9]+)/.exec($(ev.target).closest(".levelRow")[0].id);
  let row = match[1];

  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");

  match = /card([0-9]+)/.exec(data);
  let card = match[1];

  if(row == card) {
    ev.target.appendChild(document.getElementById(data));

    $(".levelRow").each(function(index, el) {
      let contents = "";
      $(el).find("td").each((index, el) => contents += $(el).html());
      if(!/\S/.test(contents)) $(el).remove();
    });

    match = /col([0-9]+)/.exec($(ev.target).attr("class").split(/\s+/)[0]);
    let col = match[1];
    $("#level" + card).val(col);
  }
}

// the template for a new chapter card
let addChapterCard = function(data, chapter, oldChapter = true) {
  $("#levelTable").append(`
    <tr id="${"row" + chapter}" class="levelRow">
      <td class="col${levelList[0]}" ondrop="drop(event)" ondragover="allowDrop(event)">
        <div class="card" draggable="true" ondragstart="drag(event)" id="card${chapter}">
          <div class="card-header" id="heading${chapter}" data-toggle="collapse" data-target="#collapse${chapter}" aria-expanded="false" aria-controls="collapse${chapter}">
            <div class="d-flex justify-content-between">
              <div class="d-flex" onclick="event.stopPropagation()">
                <abbr title="Remove Chapter">
                  <button class="delchapter btn btn-outline-danger" id="del${chapter}" type="button" onclick="delChapterFunction(event)"><i class="fas fa-minus-circle"></i></button>
                </abbr>
              </div>
              <div class="d-flex align-content-center">
                <input class="form-control" id="name${chapter}" type="text" name="name${chapter}" placeholder="Chapter ${chapter}" 
                  value="${oldChapter && story_ID.value >= 0 ? data["name" + chapter] : ''}" onclick="event.stopPropagation()" />
              </div>
              <div class="d-flex" onclick="event.stopPropagation()">
                <abbr title="Add Chapter">
                  <button class="addchapter btn btn-outline-primary" id="add${chapter}" type="button" onclick="addChapterFunction()"><i class="fas fa-plus-circle"></i></button>
                </abbr>
              </div>
            </div>
          </div>
          <div class="collapse show" id="collapse${chapter}" aria-labelledby="heading${chapter}">
            <div class="card-body">
              <input class="form-control levelField" id="level${chapter}" type="number" name="level${chapter}" placeholder="0" value="${oldChapter && story_ID.value >= 0 ? data["level" + chapter] : '1'}" style="visibility: hidden; display: none"/>
              <div class="form-group">
                <label for="size${chapter}">Wordcount/Runtime:</label>
                <input class="form-control" id="size${chapter}" type="number" name="size${chapter}" placeholder="2500" value="${oldChapter && story_ID.value >= 0 ? data["size" + chapter] : ''}" />
              </div>
              <div class="form-group">
                <label for="characters${chapter}">Characters:</label>
                <input id="characters${chapter}" class="form-control" type="text" data-role="tagsinput" name="characters${chapter}" value="${oldChapter && story_ID.value >= 0 ? data["characters" + chapter] : ''}" />
              </div>
              <div class="form-group">
                <label for="mentions${chapter}">Mentions:</label>
                <input id="mentions${chapter}" class="form-control" type="text" data-role="tagsinput" name="mentions${chapter}" value="${oldChapter && story_ID.value >= 0 ? data["mentions" + chapter] : ''}" />
              </div>
              <div class="form-group">
                <label for="extra${chapter}">Extra:</label>
                <input id="extra${chapter}" class="form-control" type="text" data-role="tagsinput" name="extra${chapter}" value="${oldChapter && story_ID.value >= 0 ? data["extra" + chapter] : ''}" />
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>`);
  $("#characters" + chapter).tagsinput("refresh");
  $("#mentions" + chapter).tagsinput("refresh");
  $("#extra" + chapter).tagsinput("refresh");

  levelList.forEach((level, index) => {
    if(index > 0) $("#row" + chapter).append(`<td class="${'col' + level}" ondrop="drop(event)" ondragover="allowDrop(event)"></td>`);
  });

  if($("#level" + chapter).val() != levelList[0]) {
    $("#row" + chapter).find(".col" + $("#level" + chapter).val())[0].appendChild(document.getElementById("card" + chapter));
  }
};

// template for a level column
let addLevel = function(level) {
  $("#levelHead").append(`
    <th>
      <div class="d-flex justify-content-between">
        <div class="d-flex" onclick="event.stopPropagation()">
          <abbr title="Remove Level">
            <button class="dellevel btn btn-outline-danger" id="delLevel${level}" type="button" onclick="delLevelFunction(event)"><i class="fas fa-minus-circle"></i></button>
          </abbr>
        </div>
        <div class="d-flex align-content-center">
          <input id="levelName${level}" class="form-control" type="text" name="levelName${level}" value="${data["levelName" + level] ? data["levelName" + level] : 'Level ' + level}" />
        </div>
        <div class="d-flex" onclick="event.stopPropagation()">
          <abbr title="Add Level">
            <button class="addlevel btn btn-outline-primary" id="addLevel${level}" type="button" onclick="addLevelFunction()"><i class="fas fa-plus-circle"></i></button>
          </abbr>
        </div>
      </div>
      
    </th>
  `);
};

// init the page

let levels = 1;
let levelList = [];

// see how many levels the loaded data has already
// important because the level numbers are always in order, but not necessarily contiguous (e.g. if some have been deleted)
if(data.level1) {
  for(const [key, value] of Object.entries(data)) {
    let regex = /(\D+)(\d+)/;
    let match = key.match(regex);
    if(match) {
      if(match[1] == "levelName") {
        if(!levelList.includes(match[2])) levelList.push(match[2]);
        if(match[2] > levels) levels = match[2];
      }
    }
  }
}

// must have at least one level
if(levelList.length == 0) levelList.push("1");

// add the levels to the table
levelList.forEach((level) => {
  addLevel(level);
  $(".levelRow").each(function(index, el) {
    $(el).append(`<td class="${'col' + level}" ondrop="drop(event)" ondragover="allowDrop(event)"></td>`);
  });
});

// init variables such as total chapters, chapter count, total level and level count etc.
// ensures chapters and levels have unique ids
let levelCount = levelList.length;
let dellevel = 0;

let chapters = 0;
let chapterCount = 0;
let del = 0;
let collapse = true;

let chaptersToAdd = [];

// code to load in chapters when editing a story
for(const [key, value] of Object.entries(data)) {
  let regex = /(\D+)(\d+)/;
  let match = key.match(regex);
  if(match && match[1] != "levelName" && !chaptersToAdd.includes(parseInt(match[2]))) chaptersToAdd.push(parseInt(match[2]));
}

chaptersToAdd.forEach((chapter) => {
  addChapterCard(data, chapter);
});

if(chaptersToAdd.length > 0) {
  chapters = Math.max(...chaptersToAdd);
  chapterCount = chaptersToAdd.length;
}

// otherwise start with a blank chapter
if(chapters == 0) {
  chapters++;
  chapterCount++;
  addChapterCard(data, chapters, levels);
}

// function to add and delete levels
// need to keep track of level numbers etc.
// also need to move all chapters in a deleted level to the level below

let addLevelFunction = function() {
  levels++;
  levelCount++;
  levelList.push(levels.toString());
  addLevel(levels);
  $(".levelRow").each(function(index, el) {
    $(el).append(`<td class="${'col' + levels}" ondrop="drop(event)" ondragover="allowDrop(event)"></td>`);
  });
};

let delLevelFunction = function(event) {
  if(levelCount > 1) {
    $('#dellevelconfirm').modal('show');
    let id = $(event.target).closest('button')[0].id;
    let match = /delLevel([0-9]+)/.exec(id);
    dellevel = match[1];
  } else {
    $("#minlevel").modal();
  }
};

$("#dellevelyes").click(function() {
  let levelIndex = levelList.indexOf(dellevel);
  $("#delLevel" + dellevel).closest("th").remove();
  $(".col" + dellevel).each(function(index, el) {
    if(/\S/.test($(el).html())) {
      $(el).find(".card").find(".levelField")[0].value = levelIndex == 0 ? levelList[levelIndex + 1] : levelList[levelIndex - 1];
      $(el).closest("tr").find(".col" + (levelIndex == 0 ? levelList[levelIndex + 1] : levelList[levelIndex - 1]))[0].appendChild($(el).find(".card")[0]);
      $(el).remove();
    } else {
      $(el).remove();
    }
  });
  levelCount--;
  levelList.splice(levelIndex, 1);
});

// functions to add and delete chapters
// have to keep track of the chapter numbers

let addChapterFunction = function() {
  chapters++;
  chapterCount++;
  addChapterCard(data, chapters, false);
  $("#collapseall").html("Collapse All");
  collapse = true;
};

let delChapterFunction = function(event) {
  if(chapterCount > 1) {
    $('#delconfirm').modal('show');
    let id = $(event.target).closest('button')[0].id;
    let match = /del([0-9]+)/.exec(id);
    del = match[1];
  } else {
    $("#minchapter").modal();
  }
};

$("#delyes").click(function() {
  console.log(del);
  $("#del" + del).closest("tr").remove();
  chapterCount--;
});

// function to collapse all chapters
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