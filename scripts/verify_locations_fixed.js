
const fs = require('fs');
const path = require('path');

try {
    const dataPath = path.join(__dirname, 'data_de_fantasy.js');
    let rawData = fs.readFileSync(dataPath, 'utf8');

    // Regex replacement for safety
    rawData = rawData.replace(/export\s+const\s+QUEST_DATA_FANTASY_DE\s*=\s*/, 'const QUEST_DATA_FANTASY_DE = ');
    rawData += "\nmodule.exports = QUEST_DATA_FANTASY_DE;";

    const tempPath = path.join(__dirname, 'temp_locations_check.js');

    fs.writeFileSync(tempPath, rawData);

    console.log("Loading module from temp file:", tempPath);
    const data = require(tempPath);

    console.log("--- Counts ---");
    console.log("Locations Dungeon: " + (data.locations_dungeon ? data.locations_dungeon.length : "MISSING"));
    console.log("Locations Urban: " + (data.locations_urban ? data.locations_urban.length : "MISSING"));
    console.log("Locations Wild: " + (data.locations_wild ? data.locations_wild.length : "MISSING"));
    console.log("Locations Mystic: " + (data.locations_mystic ? data.locations_mystic.length : "MISSING"));
    console.log("Locations General: " + (data.locations_general ? data.locations_general.length : "MISSING"));
    console.log("Targets Person: " + (data.targets_person ? data.targets_person.length : "MISSING"));

    // cleanup
    try { fs.unlinkSync(tempPath); } catch (e) { }
    console.log("Verification PASSED.");

} catch (e) {
    console.error("Verification failed:", e.message);
    process.exit(1);
}
