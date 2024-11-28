#!/bin/bash

rootdir=$(realpath "$(dirname "$0")/..")
libdir=$(realpath "$rootdir/lib")

for package in "${libdir}"/*; do
    if [[ ! -d "$package" ]]; then
        continue
    fi

    lib=$(jq -re '.main' "$package/package.json")
    if [[ ! -f "$package/$lib" ]]; then
        echo "ERROR: $lib does not exist." >&2
        exit 1
    fi
done
