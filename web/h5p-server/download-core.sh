#!/bin/sh
# Télécharge les fichiers core/editor H5P (tags h5p-php-library / h5p-editor-php-library)
core_version=$1
editor_version=$2

if [ -z "$core_version" ]; then
  echo "Usage: download-core.sh <core-tag> [editor-tag]"
  exit 1
fi

if [ -z "$editor_version" ]; then
  editor_version=$core_version
fi

base="$(dirname "$0")/h5p"
mkdir -p "$base/tmp/core" "$base/tmp/editor" "$base/core" "$base/editor" "$base/libraries"

echo "Downloading H5P core $core_version..."
echo "Downloading H5P editor $editor_version..."

curl -fsSL "https://github.com/h5p/h5p-php-library/archive/${core_version}.zip" -o "$base/tmp/core.zip"
curl -fsSL "https://github.com/h5p/h5p-editor-php-library/archive/${editor_version}.zip" -o "$base/tmp/editor.zip"

rm -rf "$base/core"/* "$base/editor"/*
unzip -oq "$base/tmp/core.zip" -d "$base/tmp/core"
unzip -oq "$base/tmp/editor.zip" -d "$base/tmp/editor"
mv "$base/tmp/core/h5p-php-library-${core_version}"/* "$base/core/"
mv "$base/tmp/editor/h5p-editor-php-library-${editor_version}"/* "$base/editor/"
rm -rf "$base/tmp"

echo "H5P core/editor ready."
