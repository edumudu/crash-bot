type Options = {
    maxDecimalPlaces?: number;
}

/**
 * Safely multiplies two numbers. Removing floating point errors. like 0.1 * 0.2 = 0.020000000000000004 and 0.2 * 3 = 0.6000000000000001 
 */
export function safeMultiply(a: number, b: number, {maxDecimalPlaces = 2}: Options = {}) {
  const multiplier = Math.pow(10, maxDecimalPlaces);

  return Math.round(a * b * multiplier) / multiplier;
}
