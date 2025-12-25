const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
import { RandomQuestAPI } from "./api.js";

export class QuestGeneratorApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "phils-random-quests-app",
        tag: "form",
        window: {
            title: "PRQ.App.Title",
            icon: "fas fa-scroll",
            resizable: true
        },
        classes: ["phils-random-quests-dialog"],
        position: {
            width: 500,
            height: "auto"
        },
        actions: {
            reroll: QuestGeneratorApp.prototype._onReroll,
            post: QuestGeneratorApp.prototype._onPost,
            generate: QuestGeneratorApp.prototype._onGenerate
        }
    };

    static PARTS = {
        main: {
            template: "modules/phils-random-quests/templates/app.hbs"
        }
    };

    async _onRender(context, options) {
        super._onRender(context, options);

        // Add checkbox listener for mutual exclusivity
        this.element.querySelectorAll(".rq-include-checkbox").forEach(cb => {
            cb.addEventListener("change", (ev) => this._onCheckboxChange(ev));
        });

        // Add Genre Selector Listener
        const genreSelect = this.element.querySelector("#prq-genre-select");
        if (genreSelect) {
            genreSelect.addEventListener("change", (ev) => this._onGenreChange(ev));
        }
    }

    async _onGenreChange(event) {
        const newGenre = event.target.value;
        await game.settings.set("phils-random-quests", "genre", newGenre);
        // Regenerate quest with new genre
        await this._onGenerate(event);
    }

    _onCheckboxChange(event) {
        const target = event.target;
        const itemEl = target.closest(".rq-preview-item");
        const index = itemEl.dataset.index;
        const source = itemEl.dataset.source;
        const isChecked = target.checked;

        // Persist the change to the data model
        if (this.questItems[index]) {
            this.questItems[index].isSelected = isChecked;
        }

        if (isChecked) {
            let otherSource = null;
            if (source === "Quest_Giver") otherSource = "Quest_Fantasy_Giver";
            else if (source === "Quest_Fantasy_Giver") otherSource = "Quest_Giver";

            if (otherSource) {
                // Find the other element and uncheck it
                const otherEl = this.element.querySelector(`.rq-preview-item[data-source="${otherSource}"] .rq-include-checkbox`);
                if (otherEl) {
                    otherEl.checked = false;
                    // Update the data model for the other item too
                    const otherIndex = otherEl.closest(".rq-preview-item").dataset.index;
                    if (this.questItems[otherIndex]) {
                        this.questItems[otherIndex].isSelected = false;
                    }
                }
            }
        }

        // Update Preview on selection change (since Giver changes the text)
        this.render();
    }

    async _prepareContext(options) {
        // If we don't have data, we generate it on first load
        if (!this.questItems) {
            this.questItems = await RandomQuestAPI.generateQuest();
        }

        // Feature: Get current genre and choices
        const currentGenre = game.settings.get("phils-random-quests", "genre");
        const genreChoices = {
            "fantasy": "PRQ.Genre.Fantasy",
            "pirate": "PRQ.Genre.Pirate",
            "space": "PRQ.Genre.Space",
            "western": "PRQ.Genre.Western",
            "cyberpunk": "PRQ.Genre.Cyberpunk"
        };

        // Map choices to array for HBS
        const genres = Object.entries(genreChoices).map(([key, label]) => ({
            key: key,
            label: label,
            isSelected: key === currentGenre
        }));

        // Generate the dynamic preview description based on current items
        const components = RandomQuestAPI.mapItemsToComponents(this.questItems);
        const previewHtml = RandomQuestAPI.generateDescription(components);

        return {
            items: this.questItems,
            previewHtml: previewHtml,
            genres: genres
        };
    }

    async _onReroll(event, target) {
        const index = target.closest(".rq-preview-item").dataset.index;
        const item = this.questItems[index];

        if (item) {
            // Identify active giver for context
            const activeGiver = this.questItems.find(i => (i.source === "Quest_Giver" || i.source === "Quest_Fantasy_Giver") && i.isSelected);
            const currentLocation = this.questItems.find(i => i.source === "Quest_Location");

            const context = {
                giverType: activeGiver ? activeGiver.type : null,
                fixedLocation: (currentLocation && currentLocation.text) ? currentLocation.text : null
            };

            const newItem = await RandomQuestAPI.getSingleItem(item.source, context);

            // Replace text but keep selection state
            this.questItems[index] = {
                ...newItem,
                isSelected: item.isSelected
            };

            // --- LOGIC CASCADE ---

            // 1. If Location Changed -> Update Task Text (re-inject location)
            if (item.source === "Quest_Location") {
                const taskIndex = this.questItems.findIndex(i => i.source === "Quest_Task");
                if (taskIndex > -1) {
                    const taskItem = this.questItems[taskIndex];
                    if (taskItem.originalTemplate) {
                        // Reprocess the original template with NEW location
                        const runtimeData = RandomQuestAPI.getData(); // Get base data
                        runtimeData.fixedLocation = newItem.text; // Override with new location

                        // We need to preserve other tokens if possible, but RandomQuestAPI.processTemplate is stateless.
                        // Ideally, we would need to know WHAT tokens were used. 
                        // Simplified approach: Just re-roll the whole task text using the SAME template but NEW location.
                        // This might change the monster/item too, which is a side effect.
                        // BETTER APPROACH: Just Replace the location string in the current text? 
                        // No, "forest" might be "in the forest". 

                        // "Synced Reroll": changing location regenerates the specific Text using the same template.
                        const newTaskText = RandomQuestAPI.processTemplate(taskItem.originalTemplate, runtimeData);

                        this.questItems[taskIndex].text = newTaskText;
                    }
                }
            }

            this.render();
        }
    }

    async _onPost(event, target) {
        const selectedItems = [];
        // Re-read selection from data model (which is kept in sync via _onCheckboxChange)
        // Or simplified: just use this.questItems filter isSelected

        // However, to be extra safe let's rely on the checkboxes in DOM if we didn't track perfectly,
        // BUT we are rendering on change, so data model should be truthy.
        // Let's filter this.questItems.
        const itemsToPost = this.questItems.filter(i => i.isSelected);

        if (itemsToPost.length === 0) {
            ui.notifications.warn("PRQ.App.NoSelection", { localize: true });
            return;
        }

        await RandomQuestAPI.postToChat(itemsToPost);
        this.close();
    }

    async _onGenerate(event, target) {
        // Reroll ALL
        this.questItems = await RandomQuestAPI.generateQuest();
        this.render();
    }
}
