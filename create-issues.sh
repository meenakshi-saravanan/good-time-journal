#!/usr/bin/env bash

set -euo pipefail

ISSUES_DIR="github/issues"

# Check GitHub CLI
if ! command -v gh >/dev/null 2>&1; then
    echo "❌ GitHub CLI is not installed."
    exit 1
fi

# Check authentication
if ! gh auth status >/dev/null 2>&1; then
    echo "❌ Not authenticated."
    echo "Run: gh auth login"
    exit 1
fi

# Ensure issue folder exists
if [ ! -d "$ISSUES_DIR" ]; then
    echo "❌ Folder '$ISSUES_DIR' not found."
    exit 1
fi

echo "🚀 Creating issues from $ISSUES_DIR"
echo

created=0
skipped=0
failed=0

for file in "$ISSUES_DIR"/*.md; do

    [ -f "$file" ] || continue

    title=$(head -n1 "$file" | sed 's/^# //')

    # Skip if issue already exists
    if gh issue list --limit 200 --search "\"$title\" in:title" --json title \
        | grep -q "\"title\":\"$title\""; then

        echo "⏭️  Skipping: $title (already exists)"
        skipped=$((skipped + 1))
        continue
    fi

    # Remove first line (title) and create temporary body file
    body_file=$(mktemp)
    tail -n +2 "$file" > "$body_file"

    echo "Creating: $title"

    if output=$(gh issue create \
        --title "$title" \
        --body-file "$body_file" 2>&1); then

        echo "✅ Created"
        echo "$output"
        created=$((created + 1))

    else

        echo "❌ Failed"
        echo "$output"
        failed=$((failed + 1))

    fi

    rm "$body_file"

    echo

done

echo "----------------------------"
echo "Created : $created"
echo "Skipped : $skipped"
echo "Failed  : $failed"
echo "----------------------------"