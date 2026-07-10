/* eslint-disable @typescript-eslint/no-require-imports */ const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("project root contains package.json", () => {
  const packageJsonPath = path.join(__dirname, "..", "package.json");
  assert.ok(fs.existsSync(packageJsonPath));
});
