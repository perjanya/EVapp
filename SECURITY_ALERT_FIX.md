# How to Fix "Malicious Software Alert"

## Windows Defender False Positive

Your antivirus is blocking Node.js because it opens network ports. This is SAFE.

### Quick Fix:

**Option 1: Add Folder to Exclusions**
1. Open Windows Security
2. Go to "Virus & threat protection"
3. Click "Manage settings"
4. Scroll to "Exclusions"
5. Click "Add or remove exclusions"
6. Add this folder: `D:\anatomy_notes_explorer\EVapp`

**Option 2: Allow Node.js**
1. When alert appears, click "Allow on device"
2. Or add to exclusions: `C:\Program Files\nodejs\node.exe`

**Option 3: Temporarily Disable (Not Recommended)**
1. Turn off real-time protection temporarily
2. Run the app
3. Turn protection back on

### Why This Happens:
- Node.js opens ports 3000 and 5000 (web servers)
- Antivirus sees this as "suspicious network activity"
- **This is normal for web development**
- Node.js is trusted by millions of developers worldwide

### Safe to Run:
✅ All code is visible in the project (no hidden executables)
✅ Only opens local ports (localhost only)
✅ No external connections (except NSE API if enabled)
✅ Open source dependencies (npm packages)
✅ No data collection or telemetry

This is a standard React + Node.js application, completely safe.
