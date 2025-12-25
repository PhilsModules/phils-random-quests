
const fs = require('fs');
const path = require('path');

const FILES = [
    {
        path: 'f:\\Dev-Foundry\\Data\\modules\\phils-random-names\\examples\\Fantasy_Trinkets_De.md',
        type: 'trinket',
        tier: 1
    },
    {
        path: 'f:\\Dev-Foundry\\Data\\modules\\phils-random-names\\examples\\Fantasy_Books_De.md',
        type: 'book',
        tier: 1 // Books can be tier 1 or 2, let's mix nicely
    },
    {
        path: 'f:\\Dev-Foundry\\Data\\modules\\phils-random-names\\examples\\Fantasy_Treasures_De.md',
        type: 'treasure',
        tier: 2 // Treasures are likely higher value
    }
];

const TARGET_FILE = 'f:\\Dev-Foundry\\Data\\modules\\phils-random-quests\\scripts\\rewards_data.js';

function parseLine(line) {
    // Format: Name | Description | Mechanical Effect+Price
    const parts = line.split('|').map(s => s.trim());
    if (parts.length < 2) return null;

    const name = parts[0];
    const desc = parts[1];
    // Escape quotes for JS string
    const safeText = `${name}: ${desc}`.replace(/"/g, '\\"');
    return `{ text: "${safeText}" }`;
}

const Output = {
    tier1: [],
    tier2: [],
    tier3: []
};

FILES.forEach(fileDef => {
    if (!fs.existsSync(fileDef.path)) {
        console.error(`File not found: ${fileDef.path}`);
        return;
    }

    const content = fs.readFileSync(fileDef.path, 'utf8');
    const lines = content.split('\n');

    lines.forEach(line => {
        if (!line.trim()) return;
        const item = parseLine(line);
        if (item) {
            if (fileDef.type === 'trinket') {
                Output.tier1.push(item);
            } else if (fileDef.type === 'book') {
                if (Math.random() > 0.5) Output.tier1.push(item);
                else Output.tier2.push(item);
            } else if (fileDef.type === 'treasure') {
                if (Math.random() > 0.7) Output.tier3.push(item);
                else Output.tier2.push(item);
            }
        }
    });
});

let targetContent = fs.readFileSync(TARGET_FILE, 'utf8');

// Injection helper
function injectItems(content, contentKey, items) {
    if (items.length === 0) return content;
    const searchStr = `${contentKey}: [`;
    const insertion = '\n        ' + items.join(',\n        ') + ','; // Add items and trailing comma
    return content.replace(searchStr, searchStr + insertion);
}

// Inject into arrays
targetContent = injectItems(targetContent, 'rewards_fantasy_tier1', Output.tier1);
targetContent = injectItems(targetContent, 'rewards_fantasy_tier2', Output.tier2);
targetContent = injectItems(targetContent, 'rewards_fantasy_tier3', Output.tier3);

fs.writeFileSync(TARGET_FILE, targetContent, 'utf8');
console.log(`Injected ${Output.tier1.length} tier 1 items.`);
console.log(`Injected ${Output.tier2.length} tier 2 items.`);
console.log(`Injected ${Output.tier3.length} tier 3 items.`);
