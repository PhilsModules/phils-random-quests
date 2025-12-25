import { QUEST_DATA_FANTASY_DE } from "./data_de_fantasy.js";
import { QUEST_DATA_PIRATE_DE } from "./data_de_pirate.js";
import { QUEST_DATA_SPACE_DE } from "./data_de_space.js";
import { QUEST_DATA_WESTERN_DE } from "./data_de_western.js";
import { QUEST_DATA_CYBERPUNK_DE } from "./data_de_cyberpunk.js";

import { QUEST_DATA_FANTASY_EN } from "./data_en_fantasy.js";
import { QUEST_DATA_PIRATE_EN } from "./data_en_pirate.js";
import { QUEST_DATA_SPACE_EN } from "./data_en_space.js";
import { QUEST_DATA_WESTERN_EN } from "./data_en_western.js";
import { QUEST_DATA_CYBERPUNK_EN } from "./data_en_cyberpunk.js";

import { REWARDS_DATA } from "./rewards_data.js";

export class RandomQuestAPI {

    // --- Core Logic ---

    static getData() {
        const genre = game.settings.get("phils-random-quests", "genre") || "fantasy";

        if (game.i18n.lang === "de") {
            switch (genre) {
                case "fantasy": return QUEST_DATA_FANTASY_DE;
                case "pirate": return QUEST_DATA_PIRATE_DE;
                case "space": return QUEST_DATA_SPACE_DE;
                case "western": return QUEST_DATA_WESTERN_DE;
                case "cyberpunk": return QUEST_DATA_CYBERPUNK_DE;
                default: return QUEST_DATA_FANTASY_DE;
            }
        } else {
            // English / Fallback
            switch (genre) {
                case "fantasy": return QUEST_DATA_FANTASY_EN;
                case "pirate": return QUEST_DATA_PIRATE_EN;
                case "space": return QUEST_DATA_SPACE_EN;
                case "western": return QUEST_DATA_WESTERN_EN;
                case "cyberpunk": return QUEST_DATA_CYBERPUNK_EN;
                default: return QUEST_DATA_FANTASY_EN;
            }
        }
    }

    static getRandomItem(list) {
        if (!list || list.length === 0) return { text: "..." };
        return list[Math.floor(Math.random() * list.length)];
    }

    // New: Recursive Token Replacer
    static processTemplate(template, data) {
        let text = template;
        const regex = /##(.*?)##/g;
        let match;

        let attempts = 0;
        while ((match = regex.exec(text)) !== null && attempts < 10) {
            attempts++;
            const tokenFull = match[0]; // ##Item##
            const tokenName = match[1].toLowerCase(); // item

            // Map token names to data keys
            let list = null;
            let override = null;

            if (tokenName === "item") list = data.items;
            else if (tokenName === "location") {
                if (data.fixedLocation) override = data.fixedLocation;
                else list = data.locations;
            }

            // New Semantic Logic
            else if (tokenName === "targetperson") list = data.targets_person || data.targets;
            else if (tokenName === "targetmonster") list = data.targets_monster || data.targets;

            else if (tokenName === "actionitem") list = data.actions_item || data.actions;
            else if (tokenName === "actionperson") list = data.actions_person || data.actions;
            else if (tokenName === "actionmonster") list = data.actions_monster || data.actions;

            // Fallback for English or simple mode
            else if (tokenName === "target") list = data.targets;
            else if (tokenName === "action") list = data.actions;

            if (list || override) {
                let replacementText = "";

                if (override) {
                    replacementText = override;
                } else {
                    const replacement = this.getRandomItem(list);
                    // If replacement is object {text: ...}, use text, else use string
                    replacementText = (typeof replacement === 'object') ? replacement.text : replacement;
                }

                text = text.replace(tokenFull, replacementText);

                // Reset regex manually to ensure we catch next tokens or re-tokens
                regex.lastIndex = 0;
            } else {
                break;
            }
        }
        return text;
    }

    static getThemePools(giverType, data) {
        // Core theme logic extracted for re-use
        let targetPool = [];
        let locationPool = [];
        let validTemplates = [];

        // Correctly aggregate locations if specific buckets exist (fallback for generic calls)
        let allLocations = data.locations || [];
        if (!data.locations || data.locations.length === 0) {
            allLocations = (data.locations_urban || [])
                .concat(data.locations_wild || [])
                .concat(data.locations_dungeon || [])
                .concat(data.locations_mystic || [])
                .concat(data.locations_general || []);
        }

        const t = data.task_templates || [];
        const has = (str, sub) => str.includes(sub);

        const allTargets = (data.targets_person || []).concat(data.targets_monster || []).concat(data.targets || []);

        switch (giverType) {
            case "cleric":
            case "paladin":
                targetPool = data.targets_monster || [];
                locationPool = (data.locations_dungeon || []).concat(data.locations_mystic || []);
                validTemplates = t.filter(x => has(x, "Monster") || has(x, "Item"));
                break;

            case "druid":
            case "ranger":
                targetPool = data.targets_monster || [];
                locationPool = data.locations_wild || [];
                validTemplates = t.filter(x => has(x, "Monster"));
                break;

            case "rogue":
            case "criminal":
                targetPool = data.targets_person || [];
                locationPool = (data.locations_urban || []).concat(data.locations_dungeon || []);
                validTemplates = t.filter(x => has(x, "Person") || has(x, "Item"));
                break;

            case "noble":
            case "official":
            case "merchant":
            case "craftsman":
            case "artist":
            case "civilian":
                targetPool = data.targets_person || [];
                locationPool = data.locations_urban || [];
                validTemplates = t.filter(x => has(x, "Person") || has(x, "Item"));
                break;

            case "mage":
            case "scholar":
                targetPool = data.targets_monster || [];
                locationPool = (data.locations_mystic || []).concat(data.locations_dungeon || []);
                validTemplates = t.filter(x => has(x, "Monster") || has(x, "Item"));
                break;

            case "soldier":
                targetPool = (data.targets_person || []).concat(data.targets_monster || []);
                locationPool = (data.locations_wild || []).concat(data.locations_dungeon || []);
                validTemplates = t.filter(x => has(x, "Monster") || has(x, "Person"));
                break;

            default:
                targetPool = allTargets;
                locationPool = allLocations;
                validTemplates = t;
                break;
        }

        // Failsafes
        if (!targetPool || targetPool.length === 0) targetPool = allTargets;
        if (!locationPool || locationPool.length === 0) locationPool = allLocations;
        if (!validTemplates || validTemplates.length === 0) validTemplates = t;

        return { targetPool, locationPool, validTemplates };
    }

    static async generateQuest() {
        const data = this.getData();
        const genre = game.settings.get("phils-random-quests", "genre") || "fantasy";

        // 0. Select Giver First (Theme Anchor)
        if (!data.givers) return []; // Safety

        const giver = this.getRandomItem(data.givers);
        const fantasyGiver = this.getRandomItem(data.givers_fantasy || data.givers);

        // 1. Get Theme Pools
        const { targetPool, locationPool, validTemplates } = this.getThemePools(giver.type, data);

        // 2. Select Location FIRST to ensure consistency
        const locationItem = this.getRandomItem(locationPool);
        const locationText = locationItem.text || locationItem;

        // 3. Selection
        const taskTemplate = this.getRandomItem(validTemplates);

        // Runtime Data Override
        const runtimeData = {
            ...data,
            locations: locationPool,
            targets: targetPool,
            fixedLocation: locationText // PASS FIXED LOCATION
        };

        // Generate Components
        const itemComp = { text: this.getRandomItem(data.items) };
        // const locationComp = { text: this.getRandomItem(locationPool) }; // OLD Logic
        const locationComp = { text: locationText }; // NEW logic

        const reasonRaw = this.getRandomItem(data.reasons);
        const reason = (typeof reasonRaw === 'string') ? { text: reasonRaw } : reasonRaw;

        const incidentRaw = this.getRandomItem(data.incidents);
        const incident = (typeof incidentRaw === 'string') ? { text: incidentRaw } : incidentRaw;

        const deadlineRaw = this.getRandomItem(data.deadlines);
        const deadline = (typeof deadlineRaw === 'string') ? { text: deadlineRaw } : deadlineRaw;

        // Process Task Text with FIXED Location
        const taskText = this.processTemplate(taskTemplate, runtimeData);

        // 4. Rewards, Twists & Difficulty
        // Weighted Roll for Tier: 1=60%, 2=30%, 3=10%
        const roll = Math.random();
        let tier = 1;
        if (roll > 0.9) tier = 3;
        else if (roll > 0.6) tier = 2;



        let rewardPool = REWARDS_DATA[`rewards_fantasy_tier${tier}`]; // Default

        if (genre === "space" || genre === "cyberpunk") {
            rewardPool = REWARDS_DATA[`rewards_space_tier${tier}`];
        }

        // Fallback if specific tier/genre combo missing
        if (!rewardPool) rewardPool = REWARDS_DATA[`rewards_fantasy_tier${tier}`];

        let rewardTextRaw = this.getRandomItem(rewardPool || REWARDS_DATA.rewards_fantasy_tier1);
        const rewardText = (typeof rewardTextRaw === 'object' && rewardTextRaw.text) ? rewardTextRaw.text : rewardTextRaw;

        let twistTextRaw = this.getRandomItem(REWARDS_DATA.twists);
        const twistText = (typeof twistTextRaw === 'object' && twistTextRaw.text) ? twistTextRaw.text : twistTextRaw;

        // Add difficulty label locally
        const tierLabels = {
            1: "I (Simpel)",
            2: "II (Erfahren)",
            3: "III (Heroisch)"
        };


        return [
            { source: "Quest_Giver", text: giver.text, label: game.i18n.localize("PRQ.Label.Quest_Giver"), isSelected: true, ...giver },

            { source: "Quest_Task", text: taskText, label: game.i18n.localize("PRQ.Label.Quest_Task"), isSelected: true, type: "generated", originalTemplate: taskTemplate }, // Store template for rerolls!

            { source: "Quest_Reason", text: reason.text, label: game.i18n.localize("PRQ.Label.Quest_Reason"), isSelected: true, ...reason },
            { source: "Quest_Incident", text: incident.text, label: game.i18n.localize("PRQ.Label.Quest_Incident"), isSelected: true, ...incident },
            { source: "Quest_Location", text: locationText, label: game.i18n.localize("PRQ.Label.Quest_Location"), isSelected: true, ...locationComp },
            { source: "Quest_Deadline", text: deadline.text, label: game.i18n.localize("PRQ.Label.Quest_Deadline"), isSelected: true, ...deadline },

            // Visible GM Secrets
            { source: "Quest_Tier", text: tierLabels[tier], label: "Schwierigkeit (GM)", isSelected: true },
            { source: "Quest_Reward", text: rewardText, label: "Belohnung (GM)", isSelected: true },
            { source: "Quest_Twist", text: twistText, label: "Twist (GM)", isSelected: true }
        ];
    }

    static async getSingleItem(sourceIdentifier, context = {}) {
        const data = this.getData();
        const activeGiverType = context.giverType;

        // Get Themed Pools if we have an active giver
        const pools = this.getThemePools(activeGiverType || "civilian", data);
        const targetPool = pools.targetPool;
        const locationPool = pools.locationPool;
        const validTemplates = pools.validTemplates;

        // Handling for single item reroll for granular Tasks
        if (sourceIdentifier === "Quest_Tier") {
            // Weighted Roll for Tier: 1=60%, 2=30%, 3=10% (Same as generateQuest)
            const roll = Math.random();
            let tier = 1;
            if (roll > 0.9) tier = 3;
            else if (roll > 0.6) tier = 2;

            const tierLabels = {
                1: "I (Simpel)",
                2: "II (Erfahren)",
                3: "III (Heroisch)"
            };

            return {
                source: "Quest_Tier",
                text: tierLabels[tier],
                label: "Schwierigkeit (GM)"
            };
        }

        // Handling for single item reroll for granular Tasks
        if (sourceIdentifier === "Quest_Task") {
            let taskText = "";
            const templates = validTemplates || data.task_templates;

            if (templates) {
                const template = this.getRandomItem(templates);
                const runtimeData = { ...data, fixedLocation: null }; // No fixed location for single reroll? Or should we pass it? 
                // Ideally single reroll might mismatch location if we don't pass context. 
                // For now, let it be random to allow "change".
                if (targetPool) runtimeData.targets = targetPool;
                if (locationPool) runtimeData.locations = locationPool;

                taskText = this.processTemplate(template, runtimeData);
            } else {
                const tItem = this.getRandomItem(data.tasks);
                taskText = tItem.text;
            }
            return {
                source: "Quest_Task",
                text: taskText,
                label: game.i18n.localize("PRQ.Label.Quest_Task")
            };
        }

        let list = null;
        switch (sourceIdentifier) {
            case "Quest_Giver": list = data.givers; break;
            case "Quest_Fantasy_Giver": list = (data.givers_fantasy || data.givers); break;
            case "Quest_Reason": list = data.reasons; break;
            case "Quest_Incident": list = data.incidents; break;
            case "Quest_Location": list = locationPool || (data.locations_general || data.locations); break;
            case "Quest_Deadline": list = data.deadlines; break;
            case "Quest_Reward":
                // Default to Tier 2 for single rerolls or random
                const genre = game.settings.get("phils-random-quests", "genre") || "fantasy";
                let rp = REWARDS_DATA.rewards_fantasy_tier2;
                if (genre === "space" || genre === "cyberpunk") rp = REWARDS_DATA.rewards_space_tier2;
                list = rp;
                break;
            case "Quest_Twist": list = REWARDS_DATA.twists; break;
        }

        if (!list) return { text: "...", source: sourceIdentifier };

        const itemRaw = this.getRandomItem(list);
        const itemText = (typeof itemRaw === 'object' && itemRaw.text) ? itemRaw.text : itemRaw;

        // Manual Label Override for Rewards
        let label = game.i18n.localize(`PRQ.Label.${sourceIdentifier}`);
        if (sourceIdentifier === "Quest_Reward") label = "Belohnung (GM)";
        if (sourceIdentifier === "Quest_Twist") label = "Twist (GM)";

        return {
            source: sourceIdentifier,
            text: itemText,
            label: label,
            ...(typeof itemRaw === 'object' ? itemRaw : {})
        };
    }

    static mapItemsToComponents(items) {
        const map = {};
        for (const item of items) {
            map[item.source] = item;
        }

        let activeGiver = map["Quest_Giver"];
        if (map["Quest_Fantasy_Giver"] && map["Quest_Fantasy_Giver"].isSelected) {
            activeGiver = map["Quest_Fantasy_Giver"];
        }

        return {
            activeGiver: activeGiver,
            task: map["Quest_Task"],
            reason: map["Quest_Reason"],
            incident: map["Quest_Incident"],
            location: map["Quest_Location"],
            deadline: map["Quest_Deadline"],
            tier: map["Quest_Tier"],     // New
            reward: map["Quest_Reward"],
            twist: map["Quest_Twist"],
            all: items
        };
    }

    static generateDescription(components) {
        const lang = game.i18n.lang;
        const giver = components.activeGiver;
        const task = components.task;
        const reason = components.reason;
        const location = components.location;
        const incident = components.incident;

        if (!giver || !task) return "<p>Incomplete data.</p>";

        const gText = giver.text;
        const tText = task.text;
        const rText = reason ? reason.text : "";
        const locText = (location && location.text) ? location.text : (location || ""); // Handle string or object
        const iText = incident ? incident.text : "";

        // Helper to lowercase first letter if appropriate (for sentence integration)
        const lower = (str) => {
            if (!str) return "";
            const articles = ["Ein", "Eine", "Einen", "Der", "Die", "Das", "Den", "Dem"];
            const first = str.split(" ")[0];
            // Only lowercase common articles in German/English to blend into sentences
            if (articles.includes(first) || ["A", "An", "The"].includes(first)) {
                return str.charAt(0).toLowerCase() + str.slice(1);
            }
            return str;
        };

        const gLower = lower(gText);
        const iLower = lower(iText);

        let templates = [];

        if (lang === "de") {
            // Neutral Connectors: Use colons, quotes, or direct statements.

            // --- Group A: Formal & Official ---
            templates.push(`${gText} sucht nach Abenteurern. Der Auftrag: ${tText}.`);
            templates.push(`Ein Aushang von ${gText} verkündet: "${tText}"`);
            templates.push(`Gesucht! Im Auftrag von ${gText}: ${tText}.`);
            templates.push(`Offizielle Bekanntmachung durch ${gText}: ${tText}.`);
            templates.push(`${gText} hat eine Mission für euch: ${tText}.`);
            templates.push(`Ein Bote von ${gText} überbringt die Nachricht: "${tText}"`);
            templates.push(`Der Stadtrat hat in Absprache mit ${gText} entschieden: ${tText}.`);
            templates.push(`Proklamation! ${gText} lässt verkünden: ${tText}.`);

            // --- Group A+: Reward Focused (New) ---
            templates.push(`${gText} bietet eine hohe Belohnung für: ${tText}.`);
            templates.push(`Wer will sich Gold verdienen? ${gText} braucht Hilfe: ${tText}.`);
            templates.push(`Kopfgeld! Ausgestellt von ${gText}. Der Auftrag: ${tText}.`);

            // --- Group B: Personal & Emotional ---
            templates.push(`${gText} bittet euch um Hilfe: ${tText}.`);
            templates.push(`${gText} fleht euch an: "${tText}"`);
            templates.push(`${gText} wirkt verzweifelt. Die Bitte: ${tText}.`);
            templates.push(`${gText} zieht euch zur Seite und flüstert: "${tText}"`);
            templates.push(`Mit ernster Miene erklärt ${gText}: "${tText}"`);
            templates.push(`${gText} drückt euch hastig einen Zettel in die Hand. Darauf steht: "${tText}"`);
            templates.push(`${gText} vertraut euch ein Geheimnis an: ${tText}.`);
            templates.push(`Mit Tränen in den Augen sagt ${gText}: "${tText}"`);
            templates.push(`${gText} stammelt nervös: "Bitte... ${tText}"`);

            // --- Group C: Rumors & Third Party ---
            templates.push(`Man erzählt sich, ${gLower} habe ein Problem. Die Aufgabe lautet: ${tText}.`);
            templates.push(`In den Tavernen munkelt man über ${gText}. Angeblich gilt: ${tText}.`);
            templates.push(`Es heißt, ${gText} suche Unterstützung. Das Ziel: ${tText}.`);
            templates.push(`Gerüchte besagen, dass ${gText} Pläne hat: ${tText}.`);
            templates.push(`Habt ihr schon gehört? ${gText} sucht Leute. Angeblich: ${tText}.`);

            // --- Group D: Direct & Action ---
            templates.push(`${gText} beauftragt euch: ${tText}.`);
            templates.push(`${gText} sagt: "${tText}"`);
            templates.push(`Die Forderung von ${gText} ist klar: ${tText}.`);
            templates.push(`${gText} zahlt gut für folgende Tat: ${tText}.`);
            templates.push(`${gText} benötigt Söldner. Die Arbeit: ${tText}.`);
            templates.push(`${gText} kommt sofort zur Sache: ${tText}.`);
            templates.push(`Kurz und bündig erklärt ${gText}: "${tText}"`);

            // --- Group E: Narrative & Dramatic ---
            if (iText) {
                templates.push(`Ein Vorfall lässt der Bevölkerung keine Ruhe: ${iLower}. ${gText} tritt an euch heran: "${tText}"`);
                templates.push(`${iText}. ${gText} meint dazu nur: "${tText}"`);
                templates.push(`Wegen ${iLower} sucht ${gText} Hilfe: ${tText}.`);
                templates.push(`Chaos bricht aus, denn: ${iLower}. ${gText} brüllt: "${tText}"`);
            } else {
                templates.push(`Die Lage ist ernst. ${gText} erklärt: "${tText}"`);
            }

            // --- Group F: Secret / Illegal (New) ---
            templates.push(`${gText} winkt euch in eine dunkle Gasse. Der Plan: ${tText}.`);
            templates.push(`"Keine Zeugen", warnt ${gText}. "Die Aufgabe: ${tText}"`);
            templates.push(`${gText} übergibt euch einen versiegelten Brief: "${tText}"`);
            templates.push(`Unter dem Siegel der Verschwiegenheit offenbart ${gText}: ${tText}.`);
            templates.push(`${gText} sieht sich paranoid um. "Psst. ${tText}"`);

            // --- Group H: Urgent (New) ---
            templates.push(`"${gText} platzt die Tür herein! "Schnell! ${tText}"`);
            templates.push(`Es bleibt keine Zeit zu erklären. ${gText} keucht: "${tText}"`);
            templates.push(`Die Uhr tickt. ${gText} drängt euch: ${tText}.`);

            // --- Group I: Mystic (New) ---
            templates.push(`Die Karten haben es vorhergesagt. ${gText} deutet auf euch: "${tText}"`);
            templates.push(`${gText} hatte eine Vision: ${tText}.`);
            templates.push(`"Das Schicksal führt uns zusammen", sagt ${gText}. "Eure Bestimmung: ${tText}"`);

            if (rText) {
                // Template G: Reason-based
                templates.push(`${this.capitalize(rText)}. ${gText} bittet euch daher: ${tText}.`);
                templates.push(`${this.capitalize(rText)}. Folglich verlangt ${gText}: ${tText}.`);
                templates.push(`Wegen ${rText} hat ${gText} einen Wunsch: ${tText}.`);
                templates.push(`${this.capitalize(rText)}. Das ist der Grund, warum ${gText} euch braucht: ${tText}.`);
            }

        } else {
            // Fallback English
            // Template A: "Giver is looking for someone to do X."
            // tText usually starts with "to", so we don't need an extra "to".
            templates.push(`${gText} is looking for someone ${tText}.`);

            if (rText) {
                // Template B: "Reason, Giver asks you to do X."
                // rText usually includes the preposition (to, for, because).
                // tText usually starts with "to", so we say "asks you [to do X]".
                // Wait, "asks you to hack..." is correct.
                // But tText is "to hack...". So "asks you to hack" -> "asks you to hack".
                // So we need "asks you ${tText}".
                templates.push(`${this.capitalize(rText)}, ${gText} asks you ${tText}.`);
            }
        }

        const template = templates[Math.floor(Math.random() * templates.length)];
        return `<p>${template}</p>`;
    }

    static capitalize(str) {
        if (!str) return "";
        if (typeof str !== 'string') return String(str);
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static async postToChat(items) {
        if (!items) items = await this.generateQuest();

        const components = this.mapItemsToComponents(items);
        const description = this.generateDescription(components);

        // Render Card

        // Render Card
        const twistText = components.twist ? components.twist.text : null;
        const rewardText = components.reward ? components.reward.text : null;
        const tierText = components.tier ? components.tier.text : "I"; // Default to I

        let content = `<div lang="${game.i18n.lang}">
        <h3>${game.i18n.localize("PRQ.Chat.Title")}</h3>
        
        <p>
            <b>${game.i18n.localize("PRQ.Label.Quest_Task")}:</b> ${this.capitalize(components.task.text)}<br>
            <i>${description}</i>
        </p>
        <hr>
        <p>
            <b>${game.i18n.localize("PRQ.Label.Quest_Giver")}:</b> ${this.capitalize(components.activeGiver.text)}<br>
            
            ${(components.reason && components.reason.text) ? `
            <b>${game.i18n.localize("PRQ.Label.Quest_Reason")}:</b> ${this.capitalize(components.reason.text)}<br>` : ''}

            ${(components.location && components.location.text) ? `
            <b>${game.i18n.localize("PRQ.Label.Quest_Location")}:</b> ${this.capitalize(components.location.text)}<br>` : ''}
            
            ${(components.deadline && components.deadline.text) ? `
            <b>${game.i18n.localize("PRQ.Label.Quest_Deadline")}:</b> ${this.capitalize(components.deadline.text)}<br>` : ''}
            
            ${(components.incident && components.incident.text) ? `
            <b>${game.i18n.localize("PRQ.Label.Quest_Incident")}:</b> ${this.capitalize(components.incident.text)}` : ''}
        </p>
    </div>`;

        // 1. Post Public Message
        ChatMessage.create({
            content: content,
            speaker: { alias: "Quest Generator" }
        });

        // 2. Post GM Secrets (Whisper to GMs)
        if (rewardText || twistText || tierText) {
            let secretContent = `<div lang="${game.i18n.lang}">
                <h4><i class="fas fa-user-secret"></i> GM Secrets</h4>
                <p>
                    <b>Schwierigkeit:</b> Tier ${tierText}<br>
                    ${rewardText ? `<b>Belohnung:</b> ${this.capitalize(rewardText)}<br>` : ''}
                    ${twistText ? `<b>Twist:</b> ${twistText}` : ''}
                </p>
            </div>`;

            ChatMessage.create({
                content: secretContent,
                speaker: { alias: "Quest Generator (GM)" },
                whisper: ChatMessage.getWhisperRecipients("GM")
            });
        }
    }
}
