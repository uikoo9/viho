# Binary Installation (Recommended)

No Node.js required! Install viho with a single command:

## Linux & macOS

```bash
curl -fsSL https://www.viho.fun/install.sh | sh
```

Or with wget:

```bash
wget -qO- https://www.viho.fun/install.sh | sh
```

## Windows

Download the latest Windows binary from [GitHub Releases](https://github.com/uikoo9/viho/releases/latest) and add it to your PATH.

Or use PowerShell:

```powershell
irm https://www.viho.fun/install.ps1 | iex
```

## Manual Download

Download pre-built binaries for your platform from the [Releases page](https://github.com/uikoo9/viho/releases/latest):

- **Linux x64**: `viho-linux-x64`
- **Linux ARM64**: `viho-linux-arm64`
- **macOS x64 (Intel)**: `viho-macos-x64`
- **macOS ARM64 (Apple Silicon)**: `viho-macos-arm64`
- **Windows x64**: `viho-win-x64.exe`

---

# NPM Installation (Alternative)

If you prefer using npm or already have Node.js installed:

```bash
npm install -g viho
```

**Requirements:** Node.js >= 18.0.0
