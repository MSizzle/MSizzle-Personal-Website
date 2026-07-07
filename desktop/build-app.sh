#!/bin/bash
# Build "Things I Love.app" onto the Desktop from desktop/ThingsILove.swift.
#
#   bash desktop/build-app.sh
#
# Compiles the Swift source, renders the app icon from the same drawing code,
# assembles the .app bundle, and ad-hoc signs it so it launches on Apple Silicon.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
APP_NAME="Things I Love"
# Target dir defaults to the Desktop; pass one to build elsewhere, e.g.
#   bash desktop/build-app.sh desktop/dist
# (macOS App Management blocks overwriting an existing .app on the Desktop, so
#  when updating, build to desktop/dist and drag it over in Finder, or trash the
#  old app first and run with no argument.)
DEST_DIR="${1:-$HOME/Desktop}"
mkdir -p "$DEST_DIR"
APP="${DEST_DIR%/}/${APP_NAME}.app"
WORK="$(mktemp -d)"
BIN_NAME="ThingsILove"

echo "→ compiling ${BIN_NAME}"
swiftc -O "$HERE/ThingsILove.swift" -o "$WORK/$BIN_NAME"

echo "→ rendering app icon"
"$WORK/$BIN_NAME" --make-icons "$WORK"
iconutil -c icns -o "$WORK/AppIcon.icns" "$WORK/AppIcon.iconset"

echo "→ assembling bundle"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$WORK/$BIN_NAME" "$APP/Contents/MacOS/$BIN_NAME"
cp "$WORK/AppIcon.icns" "$APP/Contents/Resources/AppIcon.icns"
cp "$WORK/logo.png" "$APP/Contents/Resources/logo.png"
printf 'APPL????' > "$APP/Contents/PkgInfo"

cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>${APP_NAME}</string>
  <key>CFBundleDisplayName</key><string>${APP_NAME}</string>
  <key>CFBundleExecutable</key><string>${BIN_NAME}</string>
  <key>CFBundleIdentifier</key><string>com.montysinger.thingsilove</string>
  <key>CFBundleIconFile</key><string>AppIcon</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>13.0</string>
  <key>NSHighResolutionCapable</key><true/>
  <key>LSApplicationCategoryType</key><string>public.app-category.productivity</string>
</dict>
</plist>
PLIST

echo "→ ad-hoc signing"
codesign --force --deep --sign - "$APP"

rm -rf "$WORK"
echo "✓ built ${APP}"
