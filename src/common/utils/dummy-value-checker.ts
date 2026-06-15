const DUMMY_PATTERNS = [
  /^[a-z]{4,}$/i,
  /(.)\1{2,}/,
  /^(test|testing|dummy|asdf|qwerty|zxcv|abcd|abc|xyz|foo|bar|baz|string|undefined|null|na|n\/a|sample|example|demo|lorem|untitled|xxx+|new module|foobar)\d*$/i,
  /^[^aeiou]{5,}$/i,
];

export function isDummyValue(value: string): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return DUMMY_PATTERNS.some(p => p.test(normalized));
}
