/**
 * Formats a number with specified decimal places, decimal separator, and thousands separator,
 * mimicking PHP's `number_format()` function.
 *
 * @param {number} number - The number to format.
 * @param {number} [decimals=0] - The number of decimal places to display. Defaults to 0.
 * @param {string} [decimalSeparator='.'] - The character to use as a decimal separator. Defaults to '.'.
 * @param {string} [thousandsSeparator=','] - The character to use as a thousands separator. Defaults to ','.
 *
 * @returns {string} The formatted number as a string.
 *
 * @example
 * numberFormat(1234567.891, 2, '.', ',') // "1,234,567.89"
 * numberFormat(1234567.891, 0, '.', ',') // "1,234,568"
 * numberFormat(1234567.891, 3, ',', '.') // "1.234.567,891"
 * numberFormat(1234567.891, 2, ',', '.') // "1.234.567,89"
 */
export const numberFormat = (
  number: number,
  decimals: number = 0,
  decimalSeparator: string = ".",
  thousandsSeparator: string = ","
): string => {
  // Round the number to the specified decimal places
  const fixedNumber = number.toFixed(decimals);

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = fixedNumber.split(".");

  // Format the integer part with thousands separator
  const integerWithSeparator = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator
  );

  // If there are decimal places, return the formatted number with the decimal part
  if (decimalPart) {
    return `${integerWithSeparator}${decimalSeparator}${decimalPart}`;
  }

  // If there are no decimal places, just return the integer part
  return integerWithSeparator;
};
