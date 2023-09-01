#!/usr/bin/env bash

version="$1"

set -euo pipefail

export VERSION="${version}"

# This script is used to generate the README.md file for the repository
echo "Generating README.md file..."
gomplate -f ./README.TPL.MD -o README.MD
