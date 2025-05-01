# PrepareProj

A simple command-line tool built with Node.js to zip project folders, excluding `node_modules` and other configured items. It helps create clean, upload-ready archives of your projects.

## Features

*   Zips the contents of a specified folder or the current working directory.
*   Automatically excludes the `node_modules` directory by default.
*   Excludes other configured files/directories (e.g., `.env`, `.git`, build folders).
*   Creates a standalone executable (`.exe`) for easy distribution on Windows (using `pkg`).

## Installation (using Batch Installer)

This method uses a simple batch script to copy the executable and attempt to add it to your system PATH.

1.  Download the latest release ZIP archive from the [GitHub Releases page](<YOUR_GITHUB_REPO_URL_HERE>/releases) containing `prepareProj.exe` and `install.bat`.
2.  Unzip the archive to a temporary location.
3.  Right-click on `install.bat` and select **"Run as administrator"**.
4.  The script will attempt to:
    *   Create the directory `C:\Tools\PrepareProj`.
    *   Copy `prepareProj.exe` into that directory.
    *   Add `C:\Tools\PrepareProj` to your system PATH environment variable.
5.  **IMPORTANT:** You **MUST close and re-open** any open terminal windows (Command Prompt, PowerShell, Git Bash, etc.) for the PATH change to take effect.

## Usage

Once installed correctly and your terminal restarted:

```bash
# To zip the current directory (excluding node_modules, etc.)
prepareProj

# To zip a specific directory
prepareProj path/to/your/project

# Get help
prepareProj --help
```

The `.zip` file (e.g., `your-project.zip`) will be created in the directory *where you run the command*.

## Use Cases

Why use `prepareProj`? Many deployment scenarios require you to upload your project's source code, but not the bulky `node_modules` folder (which can be hundreds of megabytes). The target server or hosting platform will typically run `npm install` or `yarn install` itself based on your `package.json` and `package-lock.json`.

`prepareProj` makes creating these clean archives quick and easy directly from the command line.

**Example: Preparing a Discord.js Bot for Upload**

Imagine you have a Discord bot project in a folder named `my-discord-bot`. This folder contains your `index.js`, `config.json`, `commands/` directory, `package.json`, `package-lock.json`, and a large `node_modules` folder.

You want to upload this bot to a hosting service like [Replit](https://replit.com/), [Glitch](https://glitch.com/), [Katabump](https://katabump.com/), or even a traditional VPS or cloud server. These services often have upload limits or slow upload speeds, making the `node_modules` folder problematic.

**Solution using `prepareProj`:**

1.  Open your terminal (CMD, PowerShell, Git Bash, etc.).
2.  Navigate to your bot's project directory:
    ```bash
    cd path/to/my-discord-bot
    ```
3.  Run the command:
    ```bash
    prepareProj
    ```
4.  This will create a file named `my-discord-bot.zip` **in the same directory**.
5.  This `.zip` file contains everything *except* `node_modules` (and other configured exclusions like `.git` or `.env`).
6.  Upload `my-discord-bot.zip` to your chosen hosting service. The service can then unzip it and run `npm install` to get the necessary dependencies.

This results in a much smaller, faster upload and a cleaner deployment process.

## Building from Source

If you want to build the executable yourself:

**Prerequisites:**
*   Node.js and npm installed.
*   Git is installed.

**Steps:**

1.  Clone the repository:
    ```bash
    git clone <YOUR_GITHUB_REPO_URL_HERE>
    cd prepare-proj
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the executable (e.g., for Windows):
    ```bash
    npm run build:win
    ```
    *(Check `package.json` for other build scripts like `npm run build` for multiple platforms).*
4.  The executable (`prepareProj.exe`) will likely be in the project root or a `dist/` folder, depending on your `package.json` configuration.

## Configuration (Exclusions)

To change which files or directories are excluded by default:

1.  Edit the `EXCLUDED_DIRS` and `EXCLUDED_FILES` arrays at the top of the `index.js` file in the source code.
2.  Rebuild the executable using the steps above if you built it from source. (Note: If you only use the pre-built `.exe`, you cannot change the built-in exclusions without modifying the source and rebuilding).

## License

ISC (See `package.json`)

---

*Created by [SethunThunder]*
