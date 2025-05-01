# PrepareProj

A simple command-line tool built with Node.js to zip project folders, excluding `node_modules` and other configured items.

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