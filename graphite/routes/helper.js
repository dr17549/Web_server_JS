function formatJson(json) {
    console.log(json);
    let formatted = {};
    for(const [key, value] of Object.entries(json)) {
        if(key == "title") formatted.title = value;
        if(key == "author") formatted.author = value;
        if(key == "wordcount") formatted.wordcount = value;
        let regex = /(\D+)(\d+)/;
        let match = key.match(regex);
        if(match) {
            if(match[1] == "levelName") formatted[key] = value;
            else {
                let chapter = match[2];
                if(!(chapter in formatted)) {
                    formatted[chapter] = {};   
                }
                if(match[1] == "level") formatted[chapter].level = value;
                if(match[1] == "name") formatted[chapter].name = value;
                if(match[1] == "size") formatted[chapter].size = value;
                if(match[1] == "characters") formatted[chapter].characters = value;
                if(match[1] == "mentions") formatted[chapter].mentions = value;
                if(match[1] == "extra") formatted[chapter].extra = value;
            }
        }
    }
    return formatted;
}

function reverseJson(json) {
    let reversed = {};
    for(const [key, value] of Object.entries(json)) {
        if(key == "title") reversed.title = value;
        if(key == "author") reversed.author = value;
        if(key == "wordcount") reversed.wordcount = value;
        let regex = /(\D*)(\d+)/;
        let match = key.match(regex);
        console.log(match);
        if(match) {
            if(match[1] == "levelName") reversed[key] = value;
            else {
                let chapter = match[2];
                reversed['level' + chapter] = value.level;
                reversed['name' + chapter] = value.name;
                reversed['size' + chapter] = value.size;
                reversed['characters' + chapter] = value.characters;
                reversed['mentions' + chapter] = value.mentions;
                reversed['extra' + chapter] = value.extra;
            }
        }
    }
    console.log("Completed!");
    console.log(reversed);
    return reversed;
}

module.exports = {formatJson, reverseJson};