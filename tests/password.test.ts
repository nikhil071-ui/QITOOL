import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  generateSecurePassword, initialPasswordVisibilityState, passwordVisibilityReducer, type PasswordOptions,
} from "../lib/password";

test("password visibility starts masked and reveal/hide controls affect the current password", () => {
  assert.deepEqual(initialPasswordVisibilityState, { password: "", visible: false });
  const generated = passwordVisibilityReducer(initialPasswordVisibilityState, { type: "generated", password: "current-test-password" });
  assert.deepEqual(generated, { password: "current-test-password", visible: false });

  const revealed = passwordVisibilityReducer(generated, { type: "toggle" });
  assert.deepEqual(revealed, { password: "current-test-password", visible: true });
  assert.deepEqual(passwordVisibilityReducer(revealed, { type: "toggle" }), generated);
});

test("regenerating after reveal masks the new password with no visibility carried over", () => {
  const first = passwordVisibilityReducer(initialPasswordVisibilityState, { type: "generated", password: "first-test-password" });
  const revealed = passwordVisibilityReducer(first, { type: "toggle" });
  const second = passwordVisibilityReducer(revealed, { type: "generated", password: "second-test-password" });
  assert.deepEqual(second, { password: "second-test-password", visible: false });

  const third = passwordVisibilityReducer(passwordVisibilityReducer(second, { type: "toggle" }), { type: "generated", password: "third-test-password" });
  assert.deepEqual(third, { password: "third-test-password", visible: false });
});

test("reset after reveal clears the password and restores the masked default", () => {
  const generated = passwordVisibilityReducer(initialPasswordVisibilityState, { type: "generated", password: "reset-test-password" });
  const revealed = passwordVisibilityReducer(generated, { type: "toggle" });
  assert.deepEqual(passwordVisibilityReducer(revealed, { type: "reset" }), initialPasswordVisibilityState);
});

test("Password Generator uses the visibility reducer for generation, reveal, and reset", () => {
  const source = readFileSync("components/tools/utility-tools.tsx", "utf8");
  const generator = source.split("export function PasswordGenerator() {")[1]?.split("\n}\n")[0] ?? "";
  assert.match(generator, /useReducer\(passwordVisibilityReducer, initialPasswordVisibilityState\)/u);
  assert.match(generator, /dispatchPassword\(\{ type: "generated", password:/u);
  assert.match(generator, /dispatchPassword\(\{ type: "toggle" \}\)/u);
  assert.match(generator, /dispatchPassword\(\{ type: "reset" \}\)/u);
});

test("password generator returns the selected length and includes every requested set", () => {
  const options: PasswordOptions = { lowercase: true, uppercase: true, numbers: true, symbols: true };
  const password = generateSecurePassword(32, options);
  assert.equal(password.length, 32);
  assert.match(password, /[a-z]/);
  assert.match(password, /[A-Z]/);
  assert.match(password, /[0-9]/);
  assert.match(password, /[!@#$%^&*()\-_=+\[\]{};:,.?]/);
});

test("password generator accepts edge lengths and one character type", () => {
  assert.equal(generateSecurePassword(8, { lowercase: true, uppercase: false, numbers: false, symbols: false }).length, 8);
  assert.equal(generateSecurePassword(128, { lowercase: false, uppercase: true, numbers: true, symbols: false }).length, 128);
});

test("password generator rejects invalid lengths, empty sets, and missing Web Crypto", () => {
  const options: PasswordOptions = { lowercase: true, uppercase: false, numbers: false, symbols: false };
  assert.throws(() => generateSecurePassword(7, options), /8 to 128/);
  assert.throws(() => generateSecurePassword(129, options), /8 to 128/);
  assert.throws(() => generateSecurePassword(16, { lowercase: false, uppercase: false, numbers: false, symbols: false }), /at least one/);
  assert.throws(() => generateSecurePassword(8, options, null), /Secure password generation/);
});
