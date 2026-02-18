# KeyBindingRecall

A macOS application that displays keybinding cheatsheets for the currently active application. Perfect for developers and power users who want quick access to keyboard shortcuts without leaving their workflow.

## Features

- **Active Application Detection**: Automatically detects which application is currently in focus
- **Bundle Identifier Support**: Uses unique bundle identifiers (like Android package names) to distinguish apps
- **Terminal Sub-Process Detection**: Detects when running Vim/Neovim in iTerm2 terminals
- **Always on Top**: Floating window that stays above other applications for easy reference
- **Hot-Swappable Keybindings**: Dynamically loads and displays keybindings based on active app
- **Configurable Storage**: JSON-based keybinding files stored in `~/.config/KeyBingingRecall/`

## Requirements

- **macOS** (tested on macOS Sequoia 25.2)
- **Permissions**: Requires Accessibility and Screen Recording permissions for window detection
  - Go to **System Settings → Privacy & Security → Accessibility** and add KeyBindingRecall
  - Go to **System Settings → Privacy & Security → Screen Recording** and add KeyBindingRecall

## Installation

### From Source

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm start
```

### Build for Distribution

```bash
npm run build
```

This creates a `.dmg` file in the `dist/` folder that can be distributed and installed.

## How It Works

1. **Window Detection**: Uses AppleScript and macOS System Events to detect the active application
2. **Bundle Identifier**: Retrieves both the app name and unique bundle identifier (e.g., `com.googlecode.iterm2`)
3. **Terminal Detection**: For iTerm2, detects the active tab's TTY and foreground process (Vim/Neovim)
4. **Keybinding Loading**: Loads JSON files from `~/.config/KeyBingingRecall/` based on:
   - `{bundleId}.json` for regular applications
   - `{bundleId}_{process}.json` for terminal apps (e.g., `com.googlecode.iterm2_vim.json`)
5. **Display**: Renders keybinding categories in a clean, horizontally scrollable layout

## Configuration

### Keybinding File Location

All keybinding files are stored in:
```
~/.config/KeyBingingRecall/
```

### File Naming Convention

- **Regular Apps**: `{bundleId}.json`
  - Example: `com.microsoft.Teams.json`
- **Terminal Apps**: `{bundleId}_{process}.json`
  - Example: `com.googlecode.iterm2_vim.json`

### Keybinding File Format

```json
{
  "name": "Vim Keybindings",
  "categories": [
    {
      "name": "Movement",
      "bindings": [
        { "key": "h", "description": "Move left" },
        { "key": "j", "description": "Move down" },
        { "key": "k", "description": "Move up" },
        { "key": "l", "description": "Move right" }
      ]
    }
  ]
}
```

## Creating Custom Keybindings

1. Find the bundle identifier of your app:
   - Run: `osascript -e 'tell application "System Events" to get bundle identifier of first application process whose frontmost is true'`
2. Create a JSON file in `~/.config/KeyBingingRecall/` using the naming convention
3. Format your keybindings with categories and bindings
4. Restart KeyBindingRecall

## Project Structure

```
KeyBindingRecall/
├── detectors/                    # Low-level detection modules
│   ├── activeAppDetector.js       # Active window/app detection
│   └── subProcessDetector.js      # Terminal process detection
├── services/                     # Business logic layer
│   ├── appDetectionService.js      # Orchestrates detection
│   ├── keybindingDataService.js   # File I/O for keybindings
│   └── windowService.js           # Window management
├── main.js                       # Electron app entry point
├── index.html                     # Renderer UI
└── package.json                   # Dependencies and config
```

## Supported Terminal Apps

Currently tested and confirmed working with:
- **iTerm2** with Vim/Neovim detection

Additional terminal apps can be supported by extending the sub-process detector.

## Technical Details

- **Framework**: Electron 40.4.1
- **Language**: JavaScript (Node.js)
- **Detection Method**: AppleScript + macOS System Events + ps command
- **Build Tool**: electron-builder

## License

ISC

## Contributing

Contributions are welcome! Areas for enhancement:
- Support for additional terminal emulators (Terminal.app, Alacritty, WezTerm)
- UI improvements and theming
- Automatic keybinding import from app documentation
- Additional sub-process detection (tmux, screen, etc.)
