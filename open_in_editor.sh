#!/usr/bin/env bash

set -e

FILE=$1
CURRENT_DIR=$(pwd)

if [[ "${@#--dev}" != "$@" ]]; then
	code "$CURRENT_DIR" --reuse-window
fi

code "./data/scripts/$FILE" --new-window --wait
