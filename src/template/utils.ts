import { codeRegex, commentsRegex, templateCommentRegex } from "./regex/misc";

export function removeCommentsFromCode(input: string): string {
  return input.replace(codeRegex, (match: string, codeBlock: string) => {
    const cleanedCode = codeBlock.replace(commentsRegex, "").trim();
    return `{% ${cleanedCode} %}`; // Reconstruct the matched string
  });
}

export function removeCommentsFromTemplate(input: string): string {
  return input.replace(templateCommentRegex, "");
}

export const escapeCode = (template: string) => {
  return template
    .replace(/\\/g, "\\\\") // Escape backslashes
    .replace(/`/g, "\\`") // Escape backticks
    .replace(/\$/g, "\\$") // Escape dollar signs
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/"/g, '\\"') // Escape double quotes
    .replace(/</g, "\\<") // Escape less than
    .replace(/>/g, "\\>") // Escape greater than
    .replace(/\n/g, "\\n") // Escape newlines
    .replace(/\r/g, "\\r"); // Escape carriage returns
};

export const escapeHTML = (content: string) => {
  return content
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
