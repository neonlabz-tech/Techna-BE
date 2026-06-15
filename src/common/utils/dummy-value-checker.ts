export const DUMMY_VALUES = [
  'test', 'testing', 'asdf', 'asdfasdf', 'xxx', 'xxxx',
  '123', '1234', '12345', 'sample', 'demo', 'lorem',
  'lorem ipsum', 'abc', 'abcd', 'foo', 'bar', 'foobar',
  'untitled', 'new module', 'qwerty',
];

export function isDummyValue(value: string): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return DUMMY_VALUES.includes(normalized);
}
