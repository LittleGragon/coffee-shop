#!/usr/bin/env bash
set -euo pipefail

BASE="${WEB_BASE_URL:-http://localhost:3002}"

say() { printf "\n=== %s ===\n" "$1"; }
ok() { printf "✓ %s\n" "$1"; }
fail() { printf "✗ %s\n" "$1"; exit 1; }

# Perform request and populate globals: CODE, BODY
request() {
  local path="$1"
  local url
  if [[ "$path" =~ ^https?:// ]]; then
    url="$path"
  else
    url="${BASE}${path}"
  fi

  # Append HTTP status on the last line, keep body as-is above it
  local resp
  resp="$(curl -sS -w $'\n%{http_code}' "$url" || true)"
  CODE="$(printf "%s" "$resp" | tail -n1)"
  BODY="$(printf "%s" "$resp" | sed '$d')"
}

check_json_bool_true() {
  local json="$1" key="$2"
  echo "$json" | grep -E "\"$key\"[[:space:]]*:[[:space:]]*true" >/dev/null
}

check_json_key_exists() {
  local json="$1" key="$2"
  echo "$json" | grep -E "\"$key\"" >/dev/null
}

check_is_array_key() {
  local json="$1" key="$2"
  echo "$json" | grep -E "\"$key\"[[:space:]]*:[[:space:]]*\[" >/dev/null
}

echo "Base URL: ${BASE}"

# 1) Health
say "Health"
request "/api/health/db"
[[ "$CODE" == "200" ]] || fail "Health status $CODE. Body: $BODY"
check_json_bool_true "$BODY" "ok" || fail "Health not ok. Body: $BODY"
ok "DB health ok"

# 2) Categories
say "Categories"
request "/api/menu/categories"
[[ "$CODE" == "200" ]] || fail "Categories status $CODE. Body: $BODY"
echo "$BODY" | grep -E "\"success\"[[:space:]]*:[[:space:]]*true" >/dev/null || fail "Categories success=false. Body: $BODY"
check_is_array_key "$BODY" "data" || fail "Categories data is not an array. Body: $BODY"
ok "Categories endpoint ok"

# 3) Menu (all)
say "Menu (all)"
request "/api/menu"
[[ "$CODE" == "200" ]] || fail "Menu status $CODE. Body: $BODY"
echo "$BODY" | grep -E "\"success\"[[:space:]]*:[[:space:]]*true" >/dev/null || fail "Menu success=false. Body: $BODY"
check_is_array_key "$BODY" "data" || fail "Menu data is not an array. Body: $BODY"
ok "Menu endpoint ok"

# 4) Optional: filters (requires jq)
if command -v jq >/dev/null 2>&1; then
  # Try to get first category from categories endpoint
  request "/api/menu/categories"
  firstCat="$(printf "%s" "$BODY" | jq -r '.data[0]' 2>/dev/null || true)"
  if [[ -n "${firstCat:-}" && "$firstCat" != "null" ]]; then
    say "Menu (filter: category=${firstCat})"
    encCat="$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$firstCat")"
    request "/api/menu?category=${encCat}"
    [[ "$CODE" == "200" ]] || fail "Filtered menu status $CODE. Body: $BODY"
    echo "$BODY" | grep -E "\"success\"[[:space:]]*:[[:space:]]*true" >/dev/null || fail "Filtered menu success=false. Body: $BODY"
    ok "Category filter ok"
  fi

  # Availability filter
  say "Menu (isAvailable=true)"
  request "/api/menu?isAvailable=true"
  [[ "$CODE" == "200" ]] || fail "Availability status $CODE. Body: $BODY"
  echo "$BODY" | grep -E "\"success\"[[:space:]]*:[[:space:]]*true" >/dev/null || fail "Availability success=false. Body: $BODY"
  ok "Availability filter ok"
fi

echo -e "\nDone."