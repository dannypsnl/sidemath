# sidemath README

Math formula WYSIWYG (rely on [mathlive](https://mathlive.io/mathfield/)) sidebar editor for vscode

## Features

You can open a side panel (use <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> and type "sidemath.open") to edit math formula in it. There are copy buttons depends on your need.

<img width="1034" height="216" alt="image" src="https://github.com/user-attachments/assets/f754294b-a0cd-4367-9a06-93041e4a248b" />

The virtual keyboard will show when edit area get focus

<img width="1025" height="955" alt="image" src="https://github.com/user-attachments/assets/1d655bba-9746-4961-87fd-b66b8ca8cd51" />

If you have existed formula, you can select it and use <kbd>Alt</kbd> + <kbd>M</kbd> to edit selection in panel, by default this is expecting a LaTeX formula. When you're editing a typst document, it will accept typst formula instead.

<img width="1787" height="334" alt="image" src="https://github.com/user-attachments/assets/3653fec0-aef4-45d9-8a5e-0bafe24022de" />

## Known Issues

No

## Release Notes

### 1.4.2

- fix copied typst formula

### 1.4.0

- accept typst formula when editing a typst document

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
