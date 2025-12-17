我已完成代码修改，修复了 OutroSection 页面的排版问题。

**修改内容：**
1.  **解决遮挡问题 (`OutroSection.tsx`)**：
    *   修改逻辑，当显示“本章收获”总结页时 (`showButton` 为 true)，**自动隐藏**底部的旁白对话框 (`narration-wrapper`)。这样，总结页、按钮和下一章预告将独占屏幕空间，不再与对话框重叠，界面更加清爽。

2.  **修复弹窗位置 (`OutroSection.scss`)**：
    *   将技能 (`.skill-toast`) 和成就 (`.achievement-toast`) 弹窗的定位方式从 `absolute` 改为 `fixed`。
    *   设置 `bottom: 2rem`，分别位于 `left: 2rem` 和 `right: 2rem`。
    *   提高了 `z-index` 到 1000，确保它们始终位于最上层，不会被背景或其他元素遮挡。

3.  **优化布局容器 (`OutroSection.scss`)**：
    *   调整 `.outro-content` 容器，减少了底部的 padding（从 120px 减为 2rem），因为不再需要为对话框预留空间。
    *   添加了 `overflow-y: auto` 和 `max-height: 100vh`，确保如果内容过多（例如在小屏幕上），用户可以滚动查看完整内容，而不是被截断。

现在，当剧情对话结束后，界面将平滑过渡到总结页，所有信息（奖励、下一章、按钮）都将清晰展示，且两个奖励弹窗会稳定地出现在屏幕底部的左右两侧。