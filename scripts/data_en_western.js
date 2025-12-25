
export const QUEST_DATA_WESTERN_EN = {
    givers: [
        { text: "The sheriff who no longer wants to wear the star", type: "official", gender: "m" },
        { text: "A saloon owner with a heart of gold", type: "civilian", gender: "f" },
        { text: "An old prospector who struck 'the big one'", type: "civilian", gender: "m" },
        { text: "The undertaker already measuring for a coffin", type: "civilian", gender: "m" },
        { text: "A bounty hunter who never smiles", type: "soldier", gender: "m" },
        { text: "A rancher whose cattle were stolen", type: "civilian", gender: "f" },
        { text: "A preacher preaching fire and brimstone", type: "cleric", gender: "m" },
        { text: "The mayor who wants the railroad", type: "official", gender: "m" },
        { text: "A gunslinger who forgot his name", type: "rogue", gender: "m" },
        { text: "A widow who swore revenge", type: "civilian", gender: "f" },
        { text: "The pianist who doesn't want to shoot", type: "artist", gender: "m" },
        { text: "A native scout leaving no tracks", type: "ranger", gender: "m" },
        { text: "The bank manager sweating nervously", type: "official", gender: "m" },
        { text: "A card sharp with an ace up his sleeve", type: "rogue", gender: "m" },
        { text: "The schoolteacher new to town", type: "civilian", gender: "f" }
    ],
    items: [
        "a sack full of gold nuggets", "the dead sheriff's star", "the deed to the silver mine",
        "a colt with an ivory grip", "a bottle of 'Snake Oil'", "the key to the bank vault",
        "a wanted poster ('Dead or Alive')", "a bundle of dynamite", "a stolen tomahawk",
        "a pocket watch with a bullet hole", "a saddle with a secret compartment", "a letter from the governor",
        "the loot from the stagecoach robbery", "a golden horseshoe", "a fiddle that belonged to the devil (allegedly)"
    ],
    locations: [
        "in the 'Thirsty Coyote' Saloon", "in the ghost town by the canyon", "in the abandoned silver mine",
        "on Main Street (High Noon)", "at the train station", "in the bandit camp",
        "on the McCoy brothers' ranch", "in Death Canyon", "at the gallows hill",
        "in the tipi village", "in the bank", "in the general store",
        "by the campfire under the stars", "at the old mission church", "in the desert",
        "in the stable", "at the blacksmith's"
    ],
    targets: [
        "the bandit king 'El Diablo'", "a corrupt marshal", "the Dalton brothers",
        "a cattle rustler", "the sheriff's killer", "a wild mustang",
        "a grizzly bear", "the leader of the outlaws", "a card sharp",
        "the Man in Black"
    ],
    task_templates: [
        "to capture ##Target## 'Dead or Alive' ##Location##",
        "to safely escort the stagecoach to ##Location##",
        "to protect ##Item## ##Location## from bandits",
        "to fight a duel with ##Target## ##Location##",
        "to win ##Item## in a game of poker ##Location##",
        "to drive the cattle herd to ##Location##",
        "to break ##Target## out of jail (or guard them) ##Location##",
        "to negotiate a peace treaty with ##Target## ##Location##",
        "to prevent the train robbery ##Location##",
        "to bury ##Item## ##Location##",
        "to defend the town ##Location## from ##Target##",


        // --- Social / Intrigue ---
        "to spread a rumor about a gold vein ##Location##",
        "to bribe the sheriff ##Location##",
        "to cheat ##Target## ##Location## at poker to get information",
        "to disguise as a rich investor to deceive ##Target## ##Location##",
        "to start a brawl in the saloon ##Location## as a distraction",
        "to rig the mayor's election ##Location##",


        // --- Reverse / Morally Grey ---
        "to rob the train ##Location##",
        "to forge cattle brands ##Location##",
        "to break ##Target## out of jail (illegally) ##Location##",
        "to place dynamite under the bridge ##Location##",
        "to lure the sheriff ##Location## into a trap",
        "to rob the bank ##Location##",


        // --- Detective / Mystery ---
        "to find out who poisoned the waterhole ##Location##",
        "to read the tracks of the cattle thieves ##Location##",
        "to find the killer of the sheriff ##Location##",
        "to prove that ##Target## ##Location## cheated at cards",
        "to find the stash of the loot ##Location##",
        "to uncover the true identity of the 'Man in Black' ##Location##",


        // --- Western Specific (Wild West) ---
        "to survive a High Noon duel with ##Target## ##Location##",
        "to tame a wild mustang ##Location##",
        "to win the rodeo ##Location##",
        "to pan for gold ##Location##",
        "to challenge the fastest gun ##Location##",
        "to shoot through a hangman's noose ##Location##",
        "not to lose everything at the poker tournament ##Location##",
        "to steer a stagecoach ##Location## through hostile territory",
        "to protect a cattle drive ##Location## from a thunderstorm",
        "to return a totem to the Indian camp ##Location## (respectfully)",
        "to clear a ghost town ##Location## of bandits",
        "to disarm a dynamite stockpile ##Location##",
        "to prevent a brawl in the saloon ##Location##",
        "to sober up a drunk doctor ##Location##",
        "to compose a campfire song ##Location## that opens hearts",
        "to remove a scorpion from a boot ##Location## (carefully)",
        "to protect the rainmaker ##Location##",
        "to redirect a herd of bison ##Location##",
        "to catch the 'Iron Horse' (train) ##Location##",
        "to blow up a bridge ##Location## to shake off pursuers",
        "to make a deal with the 'Devil' at the crossroads ##Location##"
    ],
    reasons: [
        { text: "for a fistful of dollars" },
        { text: "to serve justice" },
        { text: "because the law demands it" },
        { text: "to save the farm" },
        { text: "for a few dollars more" },
        { text: "out of pure revenge" },
        { text: "to keep a promise to a dying woman" },
        { text: "to clear a name" },
        { text: "because whiskey makes you thirsty" },
        { text: "to stop (or build) the railroad" }
    ],
    incidents: [
        { text: "Bandits on the horizon" },
        { text: "A sandstorm is coming" },
        { text: "The bridge is blown up" },
        { text: "The waterhole is poisoned" },
        { text: "Vultures circling in the sky" },
        { text: "The natives are on the warpath" },
        { text: "The train is late (or was robbed)" },
        { text: "A rattlesnake in the boot" },
        { text: "Gold rush fever breaks out" },
        { text: "The sheriff is drunk" }
    ],
    deadlines: [
        { text: "before the train leaves" },
        { text: "before the sun reaches high noon" },
        { text: "before the gallows are built" },
        { text: "before the bandits reach town" },
        { text: "by sundown" },
        { text: "before the dynamite explodes" },
        { text: "before the poker tournament ends" }
    ]
};
