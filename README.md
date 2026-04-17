# Advanced Todo Card — Stage 1a

## 🚀 Project Overview

This project is an evolution of the Stage 0 Todo Card. It transitions a static component into a dynamic, stateful application using Vanilla JavaScript. Key focuses include interactive status management, editability, and high-precision time tracking.

## 🛠 Features & Changes from Stage 0

- **Full Edit Mode:** Users can modify Title, Description, Priority, and Due Date via a dedicated form.
- **Synchronized Status:** Toggle the checkbox to mark as "Done," or use the dropdown to switch between _Pending_, _In Progress_, and _Done_.
- **Collapsible Content:** Descriptions exceeding 50 characters are truncated with a "Read More" toggle for better UI density.
- **Granular Time Logic:** The countdown now reflects minutes and hours, updating every 30 seconds.

## 🎨 Design Decisions

- **Priority Accents:** Used a thick left-border accent (`6px`) to indicate priority levels without cluttering the card.
- **Overdue Styling:** If a task passes its due date, the card gains a red border and an "OVERDUE" badge, overriding standard priority colors.
- **Visual Feedback:** Completed tasks utilize muted colors and `line-through` text decoration on the title for instant recognition.

## ♿ Accessibility Notes

- **ARIA Implementation:** Added `aria-expanded` and `aria-controls` for the collapsible section.
- **Live Regions:** Used `aria-live="polite"` on the time-remaining span to update screen readers without interrupting focus.
- **Keyboard Navigation:** Ensured a logical tab order: Checkbox → Status Dropdown → Expand Toggle → Edit Button → Delete Button.

## ⚠️ Known Limitations

- Data does not persist on page refresh (no LocalStorage).
- Designed for a single-todo context per the current stage requirements.
