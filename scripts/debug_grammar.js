
const fs = require('fs');
const path = require('path');

// Mock helpers
function getRandom(arr) {
    if (!arr || arr.length === 0) return "MISSING";
    const item = arr[Math.floor(Math.random() * arr.length)];
    return typeof item === 'string' ? item : item.text;
}

try {
    const dataPath = path.join(__dirname, 'data_de_fantasy.js');
    let rawData = fs.readFileSync(dataPath, 'utf8');
    rawData = rawData.replace(/export\s+const\s+QUEST_DATA_FANTASY_DE\s*=\s*/, 'const QUEST_DATA_FANTASY_DE = ');
    rawData += "\nmodule.exports = QUEST_DATA_FANTASY_DE;";
    const tempPath = path.join(__dirname, 'temp_debug_grammar.js');
    fs.writeFileSync(tempPath, rawData);

    const data = require(tempPath);
    let output = "";

    for (let i = 0; i < 50; i++) {
        let template = getRandom(data.task_templates);

        // Tokens
        const item = getRandom(data.items);
        const location = getRandom([
            ...data.locations_dungeon,
            ...data.locations_urban,
            ...data.locations_wild,
            ...data.locations_mystic,
            ...data.locations_general
        ]);
        const targetPerson = getRandom(data.targets_person);
        const targetMonster = getRandom(data.targets_monster);
        const actionItem = getRandom(data.actions_item);
        const actionPerson = getRandom(data.actions_person);
        const actionMonster = getRandom(data.actions_monster);

        // Replace
        let quest = template
            .replace(/##Item##/g, item)
            .replace(/##Location##/g, location)
            .replace(/##TargetPerson##/g, targetPerson)
            .replace(/##TargetMonster##/g, targetMonster)
            .replace(/##ActionItem##/g, actionItem)
            .replace(/##ActionPerson##/g, actionPerson)
            .replace(/##ActionMonster##/g, actionMonster);

        output += `[${i + 1}] ${quest}\n`;
    }

    fs.writeFileSync(path.join(__dirname, 'debug_quests.txt'), output);
    fs.unlinkSync(tempPath);
    console.log("Debug quests generated.");

} catch (e) {
    console.error(e);
}
