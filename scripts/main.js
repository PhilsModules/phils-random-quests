import { RandomQuestAPI } from "./api.js";
import { QuestGeneratorApp } from "./app.js";

Hooks.once("init", () => {
    console.log("Phils Random Quests | Initializing");

    // Register Genre Setting
    game.settings.register("phils-random-quests", "genre", {
        name: "PRQ.Settings.Genre.Name",
        hint: "PRQ.Settings.Genre.Hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "fantasy": "PRQ.Genre.Fantasy",
            "pirate": "PRQ.Genre.Pirate",
            "space": "PRQ.Genre.Space",
            "western": "PRQ.Genre.Western",
            "cyberpunk": "PRQ.Genre.Cyberpunk"
        },
        default: "fantasy",
        onChange: value => {
            console.log(`Phils Random Quests | Genre changed to ${value}`);
        }
    });

    // Expose API for Macro use
    game.modules.get("phils-random-quests").api = {
        QuestGeneratorApp,
        RandomQuestAPI
    };
});

Hooks.once("ready", async () => {
    // Check if Macro exists
    const macroName = "Phil's Random Quests";
    const existing = game.macros.find(m => m.name === macroName);

    if (!existing) {
        await Macro.create({
            name: macroName,
            type: "script",
            scope: "global",
            img: "icons/sundries/scrolls/scroll-bound-grey-tan.webp",
            command: `const { QuestGeneratorApp } = game.modules.get("phils-random-quests").api;\nnew QuestGeneratorApp().render(true);`
        });
        ui.notifications.info("Phils Random Quests: Macro created in your Macro Directory!");
    }
});
