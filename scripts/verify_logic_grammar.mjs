
import fs from 'fs';
import path from 'path';
import { RandomQuestAPI } from './api.js';

// Mock Foundry VTT environment
global.game = {
    i18n: {
        lang: "de",
        localize: (key) => key // Simple mock returns key
    },
    settings: {
        get: (module, key) => "fantasy" // Default, will be overridden
    }
};

const GENRES = ["fantasy", "pirate", "space", "western", "cyberpunk"];
const LANGUAGES = ["de", "en"];
const QUESTS_PER_GENRE = 20;

let outputMarkdown = "# Quest Verification Report\n\n";

async function generateQuests() {
    for (const lang of LANGUAGES) {
        outputMarkdown += `# Language: ${lang.toUpperCase()}\n\n`;
        global.game.i18n.lang = lang;

        for (const genre of GENRES) {
            outputMarkdown += `## Genre: ${genre.charAt(0).toUpperCase() + genre.slice(1)}\n\n`;

            // Mock setting retrieval
            global.game.settings.get = (module, key) => {
                if (key === "genre") return genre;
                return null;
            };

            for (let i = 1; i <= QUESTS_PER_GENRE; i++) {
                try {
                    const items = await RandomQuestAPI.generateQuest();
                    // console.log("Items:", JSON.stringify(items, null, 2));
                    const components = RandomQuestAPI.mapItemsToComponents(items);
                    // console.log("Components:", JSON.stringify(components, null, 2));
                    const description = RandomQuestAPI.generateDescription(components);
                    console.log(`Quest ${i} [${genre}]: Description type: ${typeof description}, Value: ${description}`);

                    const questName = `Quest ${i}`;

                    outputMarkdown += `**${questName}**\n`;
                    outputMarkdown += `> ${description}\n\n`;

                    // Check for potential grammar issues in output strings
                    if (description.includes("undefined") || description.includes("null")) {
                        outputMarkdown += `> **WARNING:** Found 'undefined' or 'null' in text!\n\n`;
                    }
                    if (description.includes("  ")) { // Double spaces
                        outputMarkdown += `> **NOTE:** Found double spaces.\n\n`;
                    }
                } catch (err) {
                    outputMarkdown += `> **ERROR generating quest:** ${err.message}\n${err.stack}\n\n`;
                }
            }
            outputMarkdown += "---\n\n";
        }
    }

    fs.writeFileSync('verification_final.md', outputMarkdown, 'utf8');
    console.log("Verification report generated: verification_final.md");
}

generateQuests();
