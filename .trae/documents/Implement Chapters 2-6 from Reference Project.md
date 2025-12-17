I will implement the 2nd to 6th chapters (BattlePlain, PlayerTown, DataMetropolis, TranslationTower, FinalChapter) by migrating code from the reference project.

### 1. Asset Migration
- Copy `Gemini_Generated_Image_rxy8rprxy8rprxy8.png` from reference `assets/images` to the current project.

### 2. Service Migration
- Copy the `services` directory (containing `aiQuery.ts`) from reference to the current project.

### 3. Page Implementation (Chapters 2-6)
- **Chapter 2 (BattlePlain)**: Replace the current `BattlePlain` folder with the version from `reference/game_slangRE`. This updates the interactive components to the correct minigames (BulletCatch, Gacha, etc.).
- **Chapter 3 (PlayerTown)**: Copy the `PlayerTown` folder from reference to `src/pages`.
- **Chapter 4 (DataMetropolis)**: Copy the `DataMetropolis` folder from reference to `src/pages`.
- **Chapter 5 (TranslationTower)**: Copy the `TranslationTower` folder from reference to `src/pages`.
- **Chapter 6 (FinalChapter)**: Copy the `FinalChapter` folder from reference to `src/pages`.

### 4. Routing Configuration
- Update `src/App.tsx` to:
    - Import the new page components.
    - Add routes for:
        - `/chapter/2` (BattlePlain)
        - `/chapter/3` (PlayerTown)
        - `/chapter/4` (DataMetropolis)
        - `/chapter/5` (TranslationTower)
        - `/chapter/final` (FinalChapter)

This will fully align the web application's chapters with the reference implementation.