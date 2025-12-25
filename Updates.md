# Updates

This file tracks all changes to the **Phil's Random Quests** module.

---

### [1.2.0] - 2025-12-25
**The "Infinite Horizons" Premium Update**

This monumental update transforms the module from a simple random table roller into a fully-fledged, atmospheric quest generator. It expands the content by over **400%** and introduces completely new logic for high-quality narrative generation.

#### **Massive Content & Theme Expansion**
*   **Fantasy Genre (Depths of Magic)**: Expanded to **433** unique templates per language.
    *   **Themes**: Social Intrigue, Morally Grey, Detective Mysteries, High Magic, Narrative Epics.
*   **Multi-Genre Expansion**:
    *   **Space Opera**: AI logic errors, alien artifacts, warp drive sabotage (50+ templates).
    *   **Wild West**: Gold rushes, train robberies, poker duels (50+ templates).
    *   **Pirate & High Seas**: Buried treasure, mutinies, sea monsters (50+ templates).
    *   **Cyberpunk**: Corporate espionage, hacking missions, neon-noir (50+ templates).

#### **Narrative & Logic Polish**
*   **Neutral Grammar System**: Completely rewrote the intro-sentence logic to use neutral connectors (e.g., "Macht eine klare Ansage:"). This allows for complex task sentences without breaking German grammar.
*   **Expanded Intro Templates (50+)**: Over 50 unique introductory phrases categorized by tone (Secret, Urgent, Mystic, Official).
*   **Synced Rerolling**: Rerolling a "Location" now automatically updates the "Task" text to reflect the new location, ensuring narrative consistency.
*   **Parentheses Cleanup**: Removed all "GM Notes" (text in parentheses) from the narrative strings for a purely immersive text experience.

#### **New Core Features**
*   **Granular Slot Machine System**: Quests are now built from atomic components (Verbs, Items, Targets, Locations) allowing for millions of unique combinations.
*   **Tiered Reward System**: Rewards are now scaled by difficulty (Tier I, II, III).
*   **High Fantasy Mode**: Added a distinct "High Fantasy Giver" category (Mages, Dragons, Spirits).
*   **Premium German Translation**: Complete rewrite of all data files with high-quality, atmospheric prose.

#### **UI & UX Improvements**
*   **Premium Chat Card**: Sleek, modern Dark Mode design with high contrast for readability.
*   **Live Preview**: The generator dialog now shows a live preview of the generated quest text before you post it.
*   **Cleaner Interface**: Removed legacy buttons and improved the overall responsiveness of the dialog.

#### **Narrative & Logic Polish**
*   **Neutral Grammar System**: Completely rewrote the intro-sentence logic to use neutral connectors (e.g., "Der Auftrag:", "Bittet um Hilfe:"). This allows for much more complex task sentences without breaking German grammar.
*   **Expanded Intro Templates (50+)**: Instead of 7 basic intros, the module now features over 50 unique introductory phrases, categorized by tone (Secret, Urgent, Mystic, Official, etc.).
*   **Synced Rerolling**: Rerolling a "Location" now automatically updates the "Task" text to reflect the new location, ensuring narrative consistency while giving you granular control.
*   **Parentheses Cleanup**: Removed all "GM Notes" (text in parentheses) from the narrative strings for a purely immersive text experience.

#### **Technical Changes**
*   **Static Data Architecture**: Switched from reading Foundry Journals (slow, hard to edit) to hardcoded static JS files (fast, reliable, easy to version control).
*   **CSS Grid/Flex Hybrid**: The new chat card uses a modern CSS approach to handle variable text lengths without breaking alignment.

---

### [1.1.0] - Previous Version
*   Initial Release with basic random tables.
