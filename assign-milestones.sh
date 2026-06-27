#!/usr/bin/env bash

set -euo pipefail

# Repository
REPO="meenakshi-saravanan/good-time-journal"

# MVP milestone (#1)
for issue in 5 6 8 9 10 11 12 13 18
do
    echo "Assigning Issue #$issue → MVP"
    gh issue edit "$issue" \
        --repo "$REPO" \
        --milestone "MVP - Create Journal, Add Entries, Read Entries"
done

# Public Launch milestone (#2)
for issue in 14 15 16 17
do
    echo "Assigning Issue #$issue → Public Launch"
    gh issue edit "$issue" \
        --repo "$REPO" \
        --milestone "Public Launch"
done

echo "✅ All milestones assigned."