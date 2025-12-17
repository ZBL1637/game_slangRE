I will implement the RPG Level Selection Map style for the "Time Path" section as requested.

### 1. Structure & Logic Updates (`TimelineMap.tsx`)
*   **New HUD Component**: Add a "Time Fragments Inventory" at the top with 4 slots.
    *   Display fragment states: Uncollected (dim), Obtainable (glowing + pulse), Collected (filled + shiny).
    *   Add a title bar and a system tip note.
*   **Split Layout**: Refactor the main container into two columns:
    *   **Left: Time Path**: A vertical road with segments and badge-style nodes.
    *   **Right: Level Details Panel**: A dedicated panel showing info for the *selected* era (instead of inline cards).
*   **State Management**: Add `selectedEraId` state to track which era's details are shown in the right panel.
    *   Default to the latest unlocked era or the first era.
    *   Clicking a node updates this state.
*   **Icon Replacement**: Replace emojis with Lucide icons:
    *   Arcade: `Gamepad2`
    *   PC: `Monitor`
    *   Mobile: `Smartphone`
    *   Modern: `MessageSquare` (representing Danmaku/Social)

### 2. Visual Styling (`TimelineMap.scss`)
*   **Pixel UI Theme**:
    *   Implement 1px/2px hard borders and "hard rounded" corners.
    *   Colors: Deep Blue Background, Cyan/Green Highlights, Purple Accents.
*   **Atmosphere**:
    *   Add background texture (subtle grid/noise).
    *   Add vignette and center spotlight effect.
*   **Component Styles**:
    *   **Path**: Dashed lines for locked, glowing "energy tubes" for unlocked roads.
    *   **Nodes**: Dial/Badge design with outer rings and pulse animations for the current node.
    *   **Panel**: "System Window" look with double borders and scanline effects.
    *   **Tags**: "Skill Chip" style with tech borders.
    *   **Buttons**: pixel-depth effect (pressed state).

### 3. Animations
*   **Breathing Light**: For the current node and obtainable fragments.
*   **Flow Effect**: For unlocked road segments.
*   **Panel Transition**: Slight slide-up/fade-in when switching eras.

I will begin by refactoring the React component structure and then apply the comprehensive SCSS styles.