# sidemath README

Math formula WYSIWYG (rely on [mathlive](https://mathlive.io/mathfield/)) sidebar editor for vscode

## Features

You can open a side panel (use Ctrl+Shift+p and type "sidemath.open") to edit math formula in it. There are copy buttons depends on your need, and the virtual keyboard will show when math edit area get focus.

<img width="934" height="513" alt="image" src="https://github.com/user-attachments/assets/da268c22-00d4-42ea-baf5-15d4a5f8b1ad" />

If you have existed formula, you can select it and use Alt+M to edit selection in panel. The only problem is this only expect LaTeX formula, not typst or other forms, this might change in the future.

## Known Issues

No

## Release Notes

### 1.3.1

- fix send formula problem, it should send selection, or fall back to send whole line

### 1.3.0

- send selected formula to panel (and open panel if not opened)

### 1.2.0

- virtual keyboard worked now

### 1.1.0

- stop sync formula, add copy buttons

### 1.0.0

- side panel mathlive editor
- sync formula in clipboard
