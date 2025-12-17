I will optimize the layout by restructuring the three panels into a cohesive **"Command Center" dashboard layout**.

### The Problem
Currently, the layout is disjointed:
1.  **Top**: HUD (Floating, centered, disconnected).
2.  **Bottom**: Split into Timeline (Left) and Details (Right).
This creates a "floating boxes" look with poor visual flow and alignment.

### The Solution: Sidebar + Content Layout
I will refactor the layout into a structured **2-Column Grid**:

*   **Left Column (Navigation)**: The **Timeline Path** will become a vertical sidebar.
    *   It will align in height with the content on the right.
    *   This establishes it as the "Menu" for selecting eras.
*   **Right Column (Data)**: A vertical stack containing:
    1.  **HUD (Top)**: Full width of the right column. This places global status (fragments) right above the detailed context.
    2.  **Level Info (Bottom)**: Directly below the HUD.

### Implementation Steps

1.  **Refactor `TimelineMap.tsx`**:
    *   Group the **HUD** and **Level Info Panel** into a single `right-content-column` wrapper.
    *   Place the **Timeline Path** in a `left-sidebar` wrapper.
    *   Wrap both in a main `dashboard-grid`.

2.  **Update `TimelineMap.scss`**:
    *   **Grid System**: Create a main grid with `360px 1fr` columns and `2rem` gap.
    *   **Alignment**: Ensure the Left Sidebar stretches to match the height of the Right Column (or has a minimum height).
    *   **Consistency**: Ensure all three panels share the exact same `border-radius`, `backdrop-filter`, and `box-shadow` styles for a unified look.
    *   **Spacing**: Reduce the excessive gap between HUD and Info Panel to make them feel like related data units.

This will transform the page from "three scattered boxes" to a professional **RPG Level Selection Screen**.