#!/usr/bin/env node
/**
 * Pre-push validation stub.
 * Keeps CI responsibilities in the pipeline; do not block local pushes.
 * You can enhance this to run lint/tests if desired.
 */
try {
  console.log('[validate-code] OK');
  process.exit(0);
} catch (err) {
  console.error('[validate-code] Error:', err?.message || err);
  // Do not block push locally
  process.exit(0);
}