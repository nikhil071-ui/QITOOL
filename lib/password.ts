export type PasswordOptions = { lowercase: boolean; uppercase: boolean; numbers: boolean; symbols: boolean };
export type SecureRandomSource = Pick<Crypto, "getRandomValues">;
export type PasswordVisibilityState = { password: string; visible: boolean };
export type PasswordVisibilityAction =
  | { type: "generated"; password: string }
  | { type: "toggle" }
  | { type: "reset" };

export const initialPasswordVisibilityState: PasswordVisibilityState = { password: "", visible: false };

export function passwordVisibilityReducer(state: PasswordVisibilityState, action: PasswordVisibilityAction): PasswordVisibilityState {
  switch (action.type) {
    case "generated":
      return { password: action.password, visible: false };
    case "toggle":
      return state.password ? { ...state, visible: !state.visible } : state;
    case "reset":
      return initialPasswordVisibilityState;
  }
}

const characterSets: Record<keyof PasswordOptions, string> = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
};

function randomInteger(maxExclusive: number, source: SecureRandomSource): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > 0x1_0000_0000) throw new Error("Random range is invalid.");
  const limit = Math.floor(0x1_0000_0000 / maxExclusive) * maxExclusive;
  const sample = new Uint32Array(1);
  do {
    source.getRandomValues(sample);
  } while (sample[0] >= limit);
  return sample[0] % maxExclusive;
}

export function generateSecurePassword(length: number, options: PasswordOptions, source: SecureRandomSource | null = globalThis.crypto): string {
  if (!Number.isInteger(length) || length < 8 || length > 128) throw new Error("Password length must be a whole number from 8 to 128.");
  if (!source || typeof source.getRandomValues !== "function") throw new Error("Secure password generation is unavailable in this browser.");

  const pools = (Object.keys(characterSets) as (keyof PasswordOptions)[])
    .filter((name) => options[name])
    .map((name) => characterSets[name]);
  if (pools.length === 0) throw new Error("Choose at least one character type.");
  const allCharacters = pools.join("");
  const passwordCharacters = pools.map((pool) => pool[randomInteger(pool.length, source)]);
  while (passwordCharacters.length < length) {
    passwordCharacters.push(allCharacters[randomInteger(allCharacters.length, source)]);
  }
  for (let index = passwordCharacters.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(index + 1, source);
    [passwordCharacters[index], passwordCharacters[swapIndex]] = [passwordCharacters[swapIndex], passwordCharacters[index]];
  }
  return passwordCharacters.join("");
}
