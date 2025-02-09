// Shuffle the characters in a string
export const shuffle = function (data: string): string {
  const a = data.split("");
  const n = a.length;

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
};

// Capitalize the first letter of a string
export function capitalize(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Capitalize the first letter of each word in a string
export function capitalizeWords(text: string): string {
  return text.split(" ").map(capitalize).join(" ");
}

// Convert a string to snake_case
export function toSnakeCase(text: string): string {
  return text
    .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    .replace(/\s+/g, "_")
    .toLowerCase();
}

// Convert a string to kebab-case
export function toKebabCase(text: string): string {
  return text
    .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    .replace(/\s+/g, "-")
    .toLowerCase();
}

// Convert a string to camelCase
export function toCamelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, "");
}

// Reverse the characters of a string
export function reverse(text: string): string {
  return text.split("").reverse().join("");
}

// Check if a string is a palindrome
export function isPalindrome(text: string): boolean {
  const cleanedText = text.replace(/\s+/g, "").toLowerCase();
  return cleanedText === cleanedText.split("").reverse().join("");
}

// Check if a string contains only digits
export function isNumeric(text: string): boolean {
  return /^\d+$/.test(text);
}

// Convert a string to title case (first letter of each word capitalized)
export function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/\b(\w)/g, (match) => match.toUpperCase());
}
