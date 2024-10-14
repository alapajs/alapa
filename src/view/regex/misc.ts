import { escapeRegex } from "../../utils";

export const attributeRegex = /([\w.-]+)=["']\s*(.*?)\s*["']/g;
export const codeRegex = /\{%([\s\S]*?)%\}/g;
export const htmlTagsRegex =
  /<[xX]:(\w+)([^/>]*)>([\s\S]*?)<\/[xX]:(\1)>|<[xX]:([\w.-:]+)(\s+[^>]*)?\s*\/>/g;

export const moduleRegex = (
  isDefault?: boolean | "all",
  ...names: string[]
): RegExp => {
  if (isDefault == "all") {
    return /<component\s*(default)?\s*([a-zA-Z0-9-:_.]*)\s*([^>]+)?\s*>\s*([\s\S]*?)\s*<\/component>/gi;
  }
  let not = "?!";
  if (isDefault) not = "";
  if (names.length === 0) {
    names.push("[a-zA-Z0-9-:_.]*");
  } else {
    names = names.map(escapeRegex);
  }
  const name = names.join("|"); // Join names with OR operator
  ///Matches all components without default
  // <component\s+(?!default\s)([a-zA-Z0-9-:_\.]*)\s*([^>]*)\s*>\s*([\s\S]*?)<\/component>
  //old pattern <component\s*(default)?\s*(input)\s*>\s*([\s\S]*?)<\/component>
  return new RegExp(
    `<component\\s+(${not}default\\s)(${name})\\s*([^>]*)\\s*>\\s*([\\s\\S]*?)<\\/component>`,
    "gi" // Flags for global and case-insensitive matching
  );
};

///<(x:\w+)([^/>]*)>([\s\S]*?)<\/(\1)>/g;

//(<x:([\w.-:]+)(\s+[^>]*)?\s*\/>)|

export const importRegex =
  /import\s+((?:{[^{}]+}|.*?))\s*(?:from)?\s*['"](.*?)['"]|import\(['"](.*?)["']\)/g;

export const commentsRegex = /\/\/.*|\/\*[^]*\*\//gm;

export const noCodeRegex = /<no-code\s*>*\s*>\s*([\s\S]*?)<\/no-code>/g;

export const outputRegex = /(?!\\)(\{{2,3})([^\\%}]*?)(\}{2,3})(?!%)/g;
export const includesRegex = /(include|require)\s?\s*\(?['"](.*?)['"]\)?;?/g;
