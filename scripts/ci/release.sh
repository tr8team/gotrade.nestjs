#!/bin/bash

set -eou pipefail

rm -rf node_modules
rm package.json
rm -rf ./.git/hooks
pnpm install conventional-changelog-conventionalcommits@6.1.0
sg release
