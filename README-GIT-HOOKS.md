# Git Hooks Setup

This project includes automated testing via Git hooks to ensure code quality before pushing.

## What's Configured

- **Pre-push hook**: Automatically runs integration tests before each `git push`
- **Test blocking**: Push is blocked if any tests fail
- **Auto-service startup**: Services are started automatically if not running

## Files Created

- `.githooks/pre-push` - The pre-push hook script
- `scripts/setup-git-hooks.sh` - Setup script for configuring hooks
- `scripts/run-fixed-tests.sh` - Runs the stabilized test suite

## How It Works

1. When you run `git push`, the pre-push hook triggers
2. Hook checks if services are running (API on :3001, Web on :5173)
3. If services aren't running, it starts them automatically
4. Runs the integration test suite (11 tests)
5. If all tests pass ✅ - push proceeds
6. If any test fails ❌ - push is blocked

## Commands

```bash
# Test the hook manually (without actually pushing)
git push --dry-run

# Bypass the hook in emergencies (not recommended)
git push --no-verify

# Run tests manually
bash scripts/run-fixed-tests.sh

# Re-setup hooks if needed
bash scripts/setup-git-hooks.sh
```

## Test Coverage

The pre-push hook runs these test categories:
- Coffee purchase flows (guest & member)
- Menu management operations
- Inventory operations
- Order lifecycle management
- UI interaction tests
- Member registration flows

## Troubleshooting

If the hook fails:
1. Check service status: `docker-compose -f docker-compose.dev.yml ps`
2. Run tests manually: `bash scripts/run-fixed-tests.sh`
3. Check logs in `/tmp/start-all.log` if services fail to start
4. Ensure all dependencies are installed: `npm install` in each package

## Emergency Override

Only use `git push --no-verify` in true emergencies, as it bypasses all quality checks.