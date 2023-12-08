#!/bin/bash

# Get the current branch name
branch_name=$(git rev-parse --abbrev-ref HEAD)

# Check if the branch is 'main' or 'staging'
if [[ "$branch_name" == "main" || "$branch_name" == "staging" ]]; then
  # If it is, exit with 0 to not ignore the build
  exit 0
else
  # If it's not, check if the current commit is part of a pull request
  if git rev-list --remotes --contains HEAD | grep -q pull; then
    # If it is, exit with 0 to not ignore the build
    exit 0
  else
    # If it's not, exit with 1 to ignore the build
    exit 1
  fi
fi