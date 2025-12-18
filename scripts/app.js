const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
import { RandomQuestAPI } from "./api.js";

export class QuestGeneratorApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "phils-random-quests-app",
        tag: "form",
        window: {
            title: "PRQ.App.Title",
            icon: "fas fa-scroll",
            resizable: true,
            controls: [
                {
                    icon: 'fas fa-sync',
                    label: "PRQ.App.UpdateContent",
                    action: "update",
                }
            ]
        },
        classes: ["phils-random-quests-dialog"],
        position: {
            width: 450,
            height: "auto"
        },
        actions: {
            reroll: QuestGeneratorApp.prototype._onReroll,
            post: QuestGeneratorApp.prototype._onPost,
            generate: QuestGeneratorApp.prototype._onGenerate,
            update: QuestGeneratorApp.prototype._onUpdate
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

        if (!isChecked) return; // We only care if something gets CHECKED

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

    async _prepareContext(options) {
        // If we don't have data, we generate it on first load
        if (!this.questItems) {
            this.questItems = await RandomQuestAPI.generateQuest();
        }

        return {
            items: this.questItems
        };
    }

    async _onReroll(event, target) {
        const index = target.closest(".rq-preview-item").dataset.index;
        const item = this.questItems[index];

        if (item) {
            const newItem = await RandomQuestAPI.getSingleItem(item.source);
            // Replace text
            this.questItems[index].text = newItem.text;
            this.render();
        }
    }

    async _onPost(event, target) {
        const selectedItems = [];
        const itemElements = this.element.querySelectorAll(".rq-preview-item");

        itemElements.forEach(el => {
            const index = el.dataset.index;
            const checkbox = el.querySelector(".rq-include-checkbox");
            if (checkbox && checkbox.checked) {
                selectedItems.push(this.questItems[index]);
            }
        });

        if (selectedItems.length === 0) {
            ui.notifications.warn("PRQ.App.NoSelection", { localize: true });
            return;
        }

        await RandomQuestAPI.postToChat(selectedItems);
        this.close();
    }

    async _onGenerate(event, target) {
        // Reroll ALL
        this.questItems = await RandomQuestAPI.generateQuest();
        this.render();
    }

    async _onUpdate(event, target) {
        try {
            await RandomQuestAPI.createOneClickContent();
            ui.notifications.info("PRQ.App.InfoUpdated", { localize: true });
            // Reroll to show new content potentially
            this.questItems = await RandomQuestAPI.generateQuest();
            this.render();
        } catch (e) {
            console.error(e);
            ui.notifications.error(e.message);
        }
    }
}
