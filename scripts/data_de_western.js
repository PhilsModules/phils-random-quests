
export const QUEST_DATA_WESTERN_DE = {
    givers: [
        { text: "Der Sheriff, der den Stern nicht mehr tragen will", type: "official", gender: "m" },
        { text: "Eine Saloon-Besitzerin mit einem Herz aus Gold", type: "civilian", gender: "f" },
        { text: "Ein alter Goldgräber, der 'den großen Fund' gemacht hat", type: "civilian", gender: "m" },
        { text: "Der Totengräber, der schon Maß nimmt", type: "civilian", gender: "m" },
        { text: "Ein Kopfgeldjäger, der nie lächelt", type: "soldier", gender: "m" },
        { text: "Eine Rancherin, der die Rinder gestohlen wurden", type: "civilian", gender: "f" },
        { text: "Ein Prediger, der Feuer und Schwefel predigt", type: "cleric", gender: "m" },
        { text: "Der Bürgermeister, der die Bahnlinie will", type: "official", gender: "m" },
        { text: "Ein Revolverheld, der seinen Namen vergessen hat", type: "rogue", gender: "m" },
        { text: "Eine Witwe, die Rache geschworen hat", type: "civilian", gender: "f" },
        { text: "Der Pianist, der nicht schießen will", type: "artist", gender: "m" },
        { text: "Ein Indianer-Scout, der keine Spuren hinterlässt", type: "ranger", gender: "m" },
        { text: "Der Bankdirektor, der nervös schwitzt", type: "official", gender: "m" },
        { text: "Ein Falschspieler mit einem Ass im Ärmel", type: "rogue", gender: "m" },
        { text: "Die Schullehrerin, die neu in der Stadt ist", type: "civilian", gender: "f" }
    ],
    items: [
        "ein Sack voller Goldnuggets", "der Stern des toten Sheriffs", "die Urkunde für die Silbermine",
        "ein Colt mit Elfenbeingriff", "eine Flasche 'Schlangenöl'", "der Schlüssel zum Safe der Bank",
        "ein Steckbrief ('Wanted: Dead or Alive')", "ein Bündel Dynamit", "ein gestohlenes Kriegsbbeil",
        "eine Taschenuhr mit Einschussloch", "ein Sattel mit Geheimfach", "ein Brief vom Gouverneur",
        "die Beute des Postkutschenüberfalls", "ein goldenes Hufeisen", "eine Geige, die dem Teufel gehörte (angeblich)"
    ],
    locations: [
        "im Saloon 'Zum Durstigen Kojoten'", "in der Geisterstadt am Canyon", "in der verlassenen Silbermine",
        "auf der Main Street (High Noon)", "am Bahnhof", "im Lager der Banditen",
        "auf der Ranch der McCkoy-Brüder", "in der Schlucht des Todes", "am Galgenhügel",
        "im Tipi-Dorf", "in der Bank", "im Gemischtwarenladen",
        "am Lagerfeuer unter den Sternen", "bei der alten Missionskirche", "in der Wüste",
        "im Stall", "beim Hufschmied"
    ],
    targets: [
        "den Banditenkönig 'El Diablo'", "einen corrupten Marshall", "die Dalton-Brüder",
        "einen Viehdieb", "den Mörder des Sheriffs", "einen wilden Mustang",
        "einen Grizzlybären", "den Anführer der Gesetzlosen", "einen Falschspieler",
        "den Mann in Schwarz"
    ],
    task_templates: [
        "##Target## ##Location## 'Tot oder Lebendig' zu fangen",
        "die Postkutsche sicher nach ##Location## zu begleiten",
        "##Item## ##Location## vor Banditen zu schützen",
        "ein Duell mit ##Target## ##Location## auszufechten",
        "##Item## beim Pokerspiel ##Location## zu gewinnen",
        "die Rinderherde nach ##Location## zu treiben",
        "##Target## ##Location## aus dem Gefängnis zu befreien (oder zu bewachen)",
        "einen Friedensvertrag mit ##Target## ##Location## auszuhandeln",
        "den Zugüberfall ##Location## zu verhindern",
        "##Item## ##Location## zu vergraben",
        "die Stadt ##Location## vor ##Target## zu verteidigen",


        // --- Social / Intrigue ---
        "ein Gerücht über eine Goldader ##Location## zu verbreiten",
        "den Sheriff ##Location## zu bestechen",
        "##Target## ##Location## beim Pokern zu betrügen, um an Informationen zu kommen",
        "sich als reicher Investor auszugeben, um ##Target## ##Location## zu täuschen",
        "einen Streit im Saloon ##Location## anzuzetteln, um abzulenken",
        "die Wahl des Bürgermeisters ##Location## zu manipulieren",


        // --- Reverse / Morally Grey ---
        "den Zug ##Location## zu überfallen",
        "die Brandmarken der Rinder ##Location## zu fälschen",
        "##Target## ##Location## aus dem Gefängnis zu befreien (gegen das Gesetz)",
        "Dynamit unter der Brücke ##Location## zu platzieren",
        "den Sheriff ##Location## in eine Falle zu locken",
        "die Bank ##Location## auszurauben",


        // --- Detective / Mystery ---
        "herauszufinden, wer das Wasserloch ##Location## vergiftet hat",
        "die Spuren der Viehdiebe ##Location## zu lesen",
        "den Mörder des Sheriffs ##Location## zu finden",
        "zu beweisen, dass ##Target## ##Location## beim Kartenspiel betrogen hat",
        "das Versteck der Beute ##Location## zu finden",
        "die wahre Identität des 'Mannes in Schwarz' ##Location## aufzudecken",


        // --- Western Specific (Wild West) ---
        "ein High-Noon-Duell mit ##Target## ##Location## zu überleben",
        "einen wilden Mustang ##Location## zu zähmen",
        "beim Rodeo ##Location## zu gewinnen",
        "Gold ##Location## zu waschen",
        "den schnellsten Schützen ##Location## herauszufordern",
        "durch den Strick des Henkers ##Location## zu schießen",
        "beim Poker-Turnier ##Location## nicht alles zu verlieren",
        "eine Postkutsche ##Location## durch feindliches Gebiet zu steuern",
        "einen Viehtrieb ##Location## vor einem Gewittersturm zu schützen",
        "ein Totem im Indianerlager ##Location## zurückzugeben (respektvoll)",
        "eine Geisterstadt ##Location## von Banditen zu säubern",
        "ein Dynamit-Lager ##Location## zu entschärfen",
        "den Saloon ##Location## vor einer Schlägerei zu bewahren",
        "einen betrunkenen Arzt ##Location## nüchtern zu machen",
        "ein Lagerfeuer-Lied ##Location## zu komponieren, das Herzen öffnet",
        "einen Skorpion aus dem Stiefel ##Location## zu entfernen (vorsichtig)",
        "den Regenmacher ##Location## zu beschützen",
        "eine Herde Bisons ##Location## umzuleiten",
        "den 'Eisernen Hengst' (Zug) ##Location## einzuholen",
        "eine Brücke ##Location## zu sprengen, um Verfolger abzuhängen",
        "einen Pakt mit dem 'Teufel' an der Wegkreuzung ##Location## zu schließen"
    ],
    reasons: [
        "für eine Handvoll Dollar", "um Gerechtigkeit zu üben", "weil das Gesetz es verlangt",
        "um die Farm zu retten", "für ein paar Dollar mehr", "aus purer Rache",
        "um ein Versprechen an eine Sterbende zu halten", "um den Namen reinzuwaschen", "weil Whiskey Durst macht",
        "um die Eisenbahn aufzuhalten (oder zu bauen)"
    ],
    incidents: [
        "Banditen am Horizont", "Ein Sandsturm zieht auf", "Die Brücke ist gesprengt",
        "Das Wasserloch ist vergiftet", "Geier kreisen am Himmel", "Die Indianer sind auf dem Kriegspfad",
        "Der Zug hat Verspätung (oder wurde überfallen)", "Eine Klapperschlange im Stiefel",
        "Goldrausch bricht aus", "Der Sheriff ist betrunken"
    ],
    deadlines: [
        "bevor der Zug abfährt", "bevor die Sonne ihren höchsten Stand erreicht (High Noon)", "bevor der Galgen steht",
        "bevor die Banditen die Stadt erreichen", "bis zum Sonnenuntergang", "bevor das Dynamit explodiert",
        "bevor das Pokerturnier endet"
    ]
};
