I will beautify the "Chapter 2 Ending Animation" (OutroSection) to match the "Time Archive" theme, making it more visually engaging and rewarding.

### 1. Visual Theme: "Time & Archives"
- **Background**: Add a dynamic "Time Vortex" background with floating particles/gears to reinforce the "Time Archive" setting.
- **Glassmorphism**: Apply a modern, semi-transparent glass effect to cards (Rewards, Next Chapter) to give a high-tech/futuristic feel.

### 2. Component Enhancements
- **Chapter Recap**:
  - Add a "Glitch" or "Typewriter" entrance animation for the main title "战斗本体平原".
  - Style the "CHAPTER 2 COMPLETE" tag with a glowing gradient border.
- **Narration Box**:
  - Enhance readability with a dark semi-transparent background and a subtle border.
  - Add a smooth fade-transition when text changes.
- **Rewards Section**:
  - **Staggered Entry**: Animate reward items popping in one by one.
  - **Skill Highlight**: Give the "Time Freeze" skill a special gold/blue pulsing glow to make it stand out.
  - **Hover Effects**: Add 3D lift effects when hovering over reward cards.
- **Next Chapter Preview**:
  - Style it as a "Portal" or "Data Stream" leading to the next area.
  - Add an arrow animation indicating forward momentum.

### 3. Implementation Steps
1.  **Update `OutroSection.tsx`**:
    - Add markup for background particles.
    - Add distinct classes for specific reward types (if needed).
2.  **Update `OutroSection.scss`**:
    - Implement `floating` and `pulse` keyframes.
    - Update `.outro-section` background to a radial gradient.
    - Refine card styles with `backdrop-filter: blur` and `box-shadow`.
    - Add staggered animation delays for list items.

### 4. Verification
- **Visual Check**: Verify the animation smoothness and layout responsiveness.
- **Interaction**: Ensure the "Click to Continue" flow remains responsive and intuitive.
