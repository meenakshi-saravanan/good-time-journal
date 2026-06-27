#!/usr/bin/env bash

set -euo pipefail

labels=(
"epic|5319E7|Large initiatives"
"feature|0E8A16|New features"
"enhancement|84B6EB|Improvements"
"bug|D73A4A|Bug fixes"
"ui|C2E0C6|User interface"
"frontend|1D76DB|Frontend work"
"backend|0052CC|Backend work"
"desktop|6F42C1|Desktop application"
"website|FBCA04|Marketing website"
"documentation|0075CA|Documentation"
"release|5319E7|Release related"
"priority:P0|B60205|Critical"
"priority:P1|D93F0B|High"
"priority:P2|FBCA04|Medium"
"priority:P3|0E8A16|Low"
"good first issue|7057FF|Good for new contributors"
"help wanted|008672|Community contributions welcome"
)

for item in "${labels[@]}"; do
    IFS="|" read -r name color description <<< "$item"

    echo "Creating label: $name"

    gh label create "$name" \
        --color "$color" \
        --description "$description" \
        --force
done

echo "✅ All labels created."