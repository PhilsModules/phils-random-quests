
import { QUEST_DATA_FANTASY_DE } from './data_de_fantasy.js';
import { QUEST_DATA_PIRATE_DE } from './data_de_pirate.js';
import { QUEST_DATA_SPACE_DE } from './data_de_space.js';
import { QUEST_DATA_WESTERN_DE } from './data_de_western.js';
import { QUEST_DATA_CYBERPUNK_DE } from './data_de_cyberpunk.js';
import { QUEST_DATA_FANTASY_EN } from './data_en_fantasy.js';
import { QUEST_DATA_PIRATE_EN } from './data_en_pirate.js';
import { QUEST_DATA_SPACE_EN } from './data_en_space.js';
import { QUEST_DATA_WESTERN_EN } from './data_en_western.js';
import { QUEST_DATA_CYBERPUNK_EN } from './data_en_cyberpunk.js';

console.log("Checking data files...");

try {
    const files = [
        { name: 'data_de_fantasy.js', data: QUEST_DATA_FANTASY_DE },
        { name: 'data_de_pirate.js', data: QUEST_DATA_PIRATE_DE },
        { name: 'data_de_space.js', data: QUEST_DATA_SPACE_DE },
        { name: 'data_de_western.js', data: QUEST_DATA_WESTERN_DE },
        { name: 'data_de_cyberpunk.js', data: QUEST_DATA_CYBERPUNK_DE },
        { name: 'data_en_fantasy.js', data: QUEST_DATA_FANTASY_EN },
        { name: 'data_en_pirate.js', data: QUEST_DATA_PIRATE_EN },
        { name: 'data_en_space.js', data: QUEST_DATA_SPACE_EN },
        { name: 'data_en_western.js', data: QUEST_DATA_WESTERN_EN },
        { name: 'data_en_cyberpunk.js', data: QUEST_DATA_CYBERPUNK_EN }
    ];

    files.forEach(file => {
        if (!file.data) {
            throw new Error(`Export missing in ${file.name}`);
        }
        if (!file.data.task_templates || !Array.isArray(file.data.task_templates)) {
            throw new Error(`task_templates missing or invalid in ${file.name}`);
        }
        console.log(`✅ ${file.name} loaded successfully (${file.data.task_templates.length} templates)`);
    });

    console.log("All files passed syntax check.");
} catch (error) {
    console.error("❌ Syntax Error or Export Error found:", error);
    process.exit(1);
}
