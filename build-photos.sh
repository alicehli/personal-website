#!/bin/bash
# Scans each trip folder under images/ and generates a photos.json manifest.
# Also resizes any images larger than 1600px on their longest side.
#
# Usage: ./build-photos.sh

set -e

for dir in images/20*_*/; do
    [ -d "$dir" ] || continue

    # Resize large images
    for img in "$dir"*.JPG "$dir"*.jpg "$dir"*.jpeg "$dir"*.png; do
        [ -f "$img" ] || continue
        w=$(sips -g pixelWidth "$img" | awk '/pixelWidth/{print $2}')
        h=$(sips -g pixelHeight "$img" | awk '/pixelHeight/{print $2}')
        if [ "$w" -gt 1600 ] || [ "$h" -gt 1600 ]; then
            sips --resampleHeightWidthMax 1600 "$img" >/dev/null
            echo "Resized: $img"
        fi
    done

    # Build photos.json — collect all images and sort alphabetically
    files=()
    for img in "$dir"*.JPG "$dir"*.jpg "$dir"*.jpeg "$dir"*.png; do
        [ -f "$img" ] || continue
        files+=("$(basename "$img")")
    done

    # Sort the array
    IFS=$'\n' sorted=($(printf '%s\n' "${files[@]}" | sort -f)); unset IFS

    # Write JSON array
    json="["
    for i in "${!sorted[@]}"; do
        [ "$i" -gt 0 ] && json+=", "
        json+="\"${sorted[$i]}\""
    done
    json+="]"

    echo "$json" > "${dir}photos.json"
    echo "Generated: ${dir}photos.json (${#files[@]} photos)"
done
