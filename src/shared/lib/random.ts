export function cryptoRandomInt(maxExclusive: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % maxExclusive;
}