import assert from "node:assert/strict";
import test from "node:test";
import { generateSecurePassword, type PasswordOptions } from "../lib/password";

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
