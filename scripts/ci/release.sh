#!/bin/bash

set -eou pipefail

rm -rf node_modules
rm package.json
rm -rf ./.git/hooks
sg release -i npm
