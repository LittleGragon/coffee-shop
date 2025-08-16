#!/usr/bin/env node
// Simple API checks for packages/web
// Usage: WEB_BASE_URL=http://localhost:3002 node packages/web/scripts/test-web-api.mjs

const BASE = process.env.WEB_BASE_URL || 'http://localhost:3002';

function log(section) {
  console.log(`\n=== ${section} ===`);
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
}
function ok(msg) {
  console.log(`✓ ${msg}`);
}

async function get(path) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, { headers: { 'accept': 'application/json' } });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 200)}`);
  }
  return { status: res.status, json, url };
}

function ensure(cond, msg) {
  if (!cond) throw new Error(msg);
}

function ensureArray(arr, msg) {
  ensure(Array.isArray(arr), msg || 'Expected an array');
  return arr;
}

(async () => {
  console.log(`Base URL: ${BASE}`);

  // 1) Health check
  try {
    log('Health');
    const { status, json } = await get('/api/health/db');
    ensure(status === 200, `Health endpoint status ${status}`);
    ensure(json && json.ok === true, `Health not ok: ${JSON.stringify(json)}`);
    ok('DB health ok');
  } catch (e) {
    fail(`Health failed: ${e.message}`);
  }

  let categories = [];
  let firstCategory = undefined;

  // 2) Categories
  try {
    log('Categories');
    const { status, json } = await get('/api/menu/categories');
    ensure(status === 200, `Categories status ${status}`);
    ensure(json && json.success === true, `Categories success=false: ${JSON.stringify(json)}`);
    categories = ensureArray(json.data, 'Categories data is not an array');
    ensure(categories.length > 0, 'No categories found');
    firstCategory = categories[0];
    ok(`Fetched ${categories.length} categories. First: ${firstCategory}`);
  } catch (e) {
    fail(`Categories failed: ${e.message}`);
  }

  // 3) Menu (all)
  let allItems = [];
  try {
    log('Menu (all)');
    const { status, json } = await get('/api/menu');
    ensure(status === 200, `Menu status ${status}`);
    ensure(json && json.success === true, `Menu success=false: ${JSON.stringify(json)}`);
    allItems = ensureArray(json.data, 'Menu data is not an array');
    ensure(allItems.length > 0, 'No menu items found');
    ok(`Fetched ${allItems.length} menu items`);
  } catch (e) {
    fail(`Menu failed: ${e.message}`);
  }

  // 4) Menu filter by category
  try {
    if (firstCategory) {
      log('Menu (category filter)');
      const { status, json, url } = await get(`/api/menu?category=${encodeURIComponent(firstCategory)}`);
      ensure(status === 200, `Filtered menu status ${status}`);
      ensure(json && json.success === true, `Filtered menu success=false: ${JSON.stringify(json)} (URL: ${url})`);
      const items = ensureArray(json.data, 'Filtered menu data is not an array');
      ensure(items.length > 0, `No items for category: ${firstCategory}`);
      const bad = items.filter(i => i.category !== firstCategory);
      ensure(bad.length === 0, `Found items with mismatched category: ${bad.length}`);
      ok(`Category filter ok (${firstCategory}) with ${items.length} items`);
    }
  } catch (e) {
    fail(`Menu category filter failed: ${e.message}`);
  }

  // 5) Menu filter by availability (true)
  try {
    log('Menu (isAvailable=true)');
    const { status, json, url } = await get(`/api/menu?isAvailable=true`);
    ensure(status === 200, `Availability status ${status}`);
    ensure(json && json.success === true, `Availability success=false: ${JSON.stringify(json)} (URL: ${url})`);
    const items = ensureArray(json.data, 'Availability data is not an array');
    const bad = items.filter(i => i.is_available !== true);
    ensure(bad.length === 0, `Found items not available among isAvailable=true result: ${bad.length}`);
    ok(`Availability filter ok with ${items.length} items`);
  } catch (e) {
    fail(`Menu availability filter failed: ${e.message}`);
  }

  // 6) Menu filter by category + availability
  try {
    if (firstCategory) {
      log('Menu (category + isAvailable=true)');
      const { status, json, url } = await get(`/api/menu?category=${encodeURIComponent(firstCategory)}&isAvailable=true`);
      ensure(status === 200, `Combined filter status ${status}`);
      ensure(json && json.success === true, `Combined success=false: ${JSON.stringify(json)} (URL: ${url})`);
      const items = ensureArray(json.data, 'Combined filter data is not an array');
      const badCat = items.filter(i => i.category !== firstCategory);
      const badAvail = items.filter(i => i.is_available !== true);
      ensure(badCat.length === 0, `Combined: mismatched category items: ${badCat.length}`);
      ensure(badAvail.length === 0, `Combined: not available items: ${badAvail.length}`);
      ok(`Combined filter ok with ${items.length} items`);
    }
  } catch (e) {
    fail(`Menu combined filter failed: ${e.message}`);
  }

  console.log('\nDone. Non-zero exit code indicates one or more checks failed.');
})();