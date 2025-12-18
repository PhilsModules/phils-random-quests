export class RandomQuestAPI {
    static getFolder() {
        return game.journal.folders.find(f => f.name === "Phils Random Quests");
    }

    static getJournals() {
        const folder = this.getFolder();
        if (!folder) return [];
        return folder.contents;
    }

    static getNames(journalEntry) {
        if (!journalEntry) return [];
        const page = journalEntry.pages.contents[0];
        if (!page) return [];

        let content = "";
        if (page.type === "text") {
            content = page.text.content;
        } else {
            return [];
        }

        const plainText = content
            .replace(/<(br|p|li|div)[^>]*>/gi, "\n")
            .replace(/<[^>]+>/g, "");

        return plainText
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    static getRandomName(journalEntry) {
        const names = this.getNames(journalEntry);
        if (names.length === 0) return null;
        return names[Math.floor(Math.random() * names.length)];
    }

    // --- Core Logic ---

    static async getSingleItem(sourceIdentifier) {
        // sourceIdentifier matches the END of the journal name (e.g. "Quest_Giver")
        // or part of it. The examples are named "Quest_Giver.md" -> Journal "Quest Giver"

        // We look for journal that matches.
        const journals = this.getJournals();

        // Map identifier to approximate name
        // "Quest_Giver" -> "Giver" or "Quest Giver"
        const friendlyName = sourceIdentifier.replace("Quest_", "").replace("_", " ");

        // Try strict then loose
        let journal = journals.find(j => j.name === friendlyName || j.name === sourceIdentifier.replace("_", " "));

        // If not found, try to auto-create content if folder is empty?
        if (!journal) {
            // Check if we haven't initialized
            if (journals.length === 0) {
                await this.createOneClickContent();
                // Refresh list
                const newJournals = this.getJournals();
                journal = newJournals.find(j => j.name === friendlyName || j.name === sourceIdentifier.replace("_", " "));
            }
        }

        if (!journal) return { text: "List Missing", source: sourceIdentifier };

        const raw = this.getRandomName(journal);
        return {
            text: raw,
            source: sourceIdentifier,
            label: game.i18n.localize(`PRQ.Label.${sourceIdentifier}`)
        };
    }

    static async generateQuest() {
        const categories = [
            "Quest_Giver",
            "Quest_Fantasy_Giver",
            "Quest_Task",
            "Quest_Reason",
            "Quest_Incident",
            "Quest_Location",
            "Quest_Deadline"
        ];

        const items = [];
        for (const cat of categories) {
            const item = await this.getSingleItem(cat);
            // Default selection: everything is selected EXCEPT Quest_Fantasy_Giver
            item.isSelected = (cat !== "Quest_Fantasy_Giver");
            items.push(item);
        }

        return items;
    }

    static async postToChat(items) {
        let content = `<div class="phils-random-names-card">
            <h3>${game.i18n.localize("PRQ.Chat.Title")}</h3><hr>`;

        for (const item of items) {
            content += `<div style="margin-bottom: 8px;">
                <strong style="display:block; font-size: 0.8em; opacity: 0.6; text-transform:uppercase;">${item.label}:</strong>
                <span style="font-size: 1.1em;">${item.text}</span>
            </div>`;
        }
        content += `</div>`;

        ChatMessage.create({
            content: content,
            speaker: { alias: "Quest Generator" }
        });
    }

    // --- Content Creation ---

    static async createOneClickContent() {
        let folder = this.getFolder();
        if (!folder) {
            folder = await Folder.create({
                name: "Phils Random Quests",
                type: "JournalEntry"
            });
        }

        const suffix = (game.i18n.lang === "de") ? "_De.md" : ".md";
        const files = [
            `Quest_Giver${suffix}`, `Quest_Fantasy_Giver${suffix}`, `Quest_Task${suffix}`, `Quest_Reason${suffix}`,
            `Quest_Incident${suffix}`, `Quest_Location${suffix}`, `Quest_Deadline${suffix}`
        ];

        for (const file of files) {
            try {
                const response = await fetch(`modules/phils-random-quests/examples/${file}`);
                if (!response.ok) continue;
                const text = await response.text();

                // Name: "Quest_Giver.md" or "Quest_Giver_De.md" -> "Quest Giver"
                const name = file.replace(suffix, "").replace(".md", "").replace("_", " ");
                const cleanText = this.cleanExampleText(text);

                // Check for existing
                const existing = folder.contents.find(j => j.name === name);
                if (existing) {
                    const page = existing.pages.contents[0];
                    if (page) {
                        await page.update({ "text.content": cleanText });
                    }
                } else {
                    // Create Journal
                    await JournalEntry.create({
                        name: name,
                        folder: folder.id,
                        pages: [{ name: "List", type: "text", text: { content: cleanText, format: 1 } }]
                    });
                }

            } catch (e) {
                console.error(e);
            }
        }
    }

    static cleanExampleText(text) {
        // Remove "List:" header if present
        const lines = text.split("\n");
        if (lines[0].trim().startsWith("List:")) {
            lines.shift();
        }
        // remove empty lines
        return lines.filter(l => l.trim().length > 0).map(l => `<p>${l}</p>`).join("");
    }
}
