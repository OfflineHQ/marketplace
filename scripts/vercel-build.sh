if [ "$VERCEL_GIT_COMMIT_REF" = "main" ] || [ "$VERCEL_GIT_COMMIT_REF" = "staging" ] || [[ "$VERCEL_GIT_COMMIT_MESSAGE" =~ "pull request" ]]; then
  # Proceed with the build
  exit 1
else
  # Skip the build
  exit 0
fi
