function formatJson(json) {
    console.log(json);
    let formatted = {};
    for(const [key, value] of Object.entries(json)) {
        console.log(key + " >> " + value);
        if(key == "title") formatted.title = value;
        if(key == "wordcount") formatted.wordcount = value;
        let regex = /(\D+)(\d+)/;
        let match = key.match(regex);
        if(match) {
            let chapter = match[2];
            if(!(chapter in formatted)) {
                formatted[chapter] = {};   
            }
            if(match[1] == "name") formatted[chapter].name = value;
            if(match[1] == "size") formatted[chapter].size = value;
            if(match[1] == "characters") formatted[chapter].characters = value;
        }
    }
    return formatted;
}

function reverseJson(json) {
    console.log("HERE!");
    let reversed = {};
    for(const [key, value] of Object.entries(json)) {
        console.log(key + " >> " + value);
        if(key == "title") reversed.title = value;
        if(key == "wordcount") reversed.wordcount = value;
        let regex = /(\d+)/;
        let match = key.match(regex);
        console.log(match);
        if(match) {
            let chapter = match[1];
            reversed['name' + chapter] = value.name;
            reversed['size' + chapter] = value.size;
            reversed['characters' + chapter] = value.characters;
        }
    }
    console.log("Completed!");
    console.log(reversed);
    return reversed;
}

module.exports = {formatJson, reverseJson};