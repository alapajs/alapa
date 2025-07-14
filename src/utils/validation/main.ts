/* eslint-disable @typescript-eslint/no-explicit-any */
import { z, ZodTypeAny, ZodObject } from "zod";
import { empty, isNull } from "../value-assertions";
import { AnyObject } from "../../interface";
import { MODEL_KEYS, REFLECT_META_MODEL_OBJECT } from "../../models/helper";
import { NonFunctionKeys } from "../../models";
export type ValidationSchema<T = any> = Partial<{
  [key in NonFunctionKeys<T>]: ValidationSchemaValue;
}>;

(z.ZodType.prototype as any).unique = function (model: any) {
  return this.superRefine(async (value: any, ctx: any) => {
    const key = ctx.path.at(-1);
    let repo = model;
    if (typeof model == "string") {
      repo = Reflect.getMetadata(MODEL_KEYS, REFLECT_META_MODEL_OBJECT, model);
    }
    const findObj: Record<string, any> = {};
    findObj[key] = value;

    const existing = await repo.findOneBy(findObj);
    if (!isNull(existing)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "must be unique",
        // path: [key]
      });
    }
  });
};

// Allow raw Zod schema in the value
export type ValidationSchemaValue =
  | string
  | string[]
  | ZodTypeAny
  | ValidationSchema;

export class Validation {
  static buildSchema(schema: ValidationSchema): ZodObject<any> {
    const buildSchema: Record<string, ZodTypeAny> = {};
    Object.keys(schema).forEach((key) => {
      const raw = schema[key];

      // Use directly if it's already a Zod schema
      if (this.isZodSchema(raw)) {
        buildSchema[key] = raw;
        return;
      }

      if (typeof raw == "object" && !Array.isArray(raw)) {
        buildSchema[key] = this.buildSchema(raw as ValidationSchema);
        return;
      }

      // Otherwise, treat as Laravel-style string or array
      const ruleList = typeof raw === "string" ? raw.split("|") : raw;
      buildSchema[key] = this.buildSchemaArray(ruleList!);
    });

    return z.object(buildSchema);
  }

  private static buildSchemaArray(rules: string[]): ZodTypeAny {
    let zodSchema: ZodTypeAny | undefined;
    for (const rule of rules) {
      const splitRules = rule.split(":");
      const name = splitRules[0].trim();
      const args = splitRules.slice(1);

      if (empty(name)) continue;

      if (!zodSchema) {
        // First rule is assumed to be the base Zod type (string, number, etc.)
        if (typeof (z as any)[name] === "function") {
          zodSchema = (z as any)[name](...this.buildArgs(args));
        } else {
          console.warn(`Unknown base schema type: ${name}`);
          zodSchema = z.any();
        }
      } else {
        // Apply modifiers like .min(), .max(), etc.
        if (typeof (zodSchema as any)[name] === "function") {
          zodSchema = (zodSchema as any)[name](...this.buildArgs(args));
        } else {
          console.warn(`Unknown modifier: ${name}`);
        }
      }
    }

    return zodSchema ?? z.any(); // Fallback
  }
  private static buildArgs(args: string[]) {
    return args.map((value) => this.castArg(value));
  }
  private static isZodSchema(value: unknown): value is ZodTypeAny {
    return typeof value === "object" && value !== null && "_def" in value;
  }

  private static castArg(arg?: string): any {
    if (arg === undefined) return undefined;

    if (!isNaN(+arg)) return +arg;

    if (arg === "true") return true;
    if (arg === "false") return false;
    if (arg === "null") return null;

    return arg;
  }

  static async validateData(
    validationSchema: ValidationSchema,
    data: AnyObject
  ) {
    const schema = this.buildSchema(validationSchema);
    const result = await schema.safeParseAsync(data);
    if (!result.success) {
      return this.format(result.error.issues);
    }
  }

  private static format(issues: z.ZodIssue[]) {
    const formattedErrors: AnyObject = {};
    for (const issue of issues) {
      const errors: string[] = [];
      const field = this.readableFieldName(issue.path);
      let message = issue.message.toLowerCase().trim();
      const type = (issue as any).type;
      const code = issue.code;
      const path = issue.path;
      if ((issue as any).expected && (issue as any).received != "undefined") {
        const splitMessage = message.split(",");
        message = `${field} ${splitMessage[0]}, but ${splitMessage[1]}`;
      } else if (message == "required" || code == "invalid_string") {
        message = `${field} is ${message}`;
      } else if (code == "too_small" || code == "too_big") {
        message = `${field} ${message.replace(type, "")}`;
      }
      errors.push(message.trim().replaceAll("  ", " "));
      if (path.length == 2) {
        if (!formattedErrors[path[0]]) {
          formattedErrors[path[0]] = {};
          formattedErrors[path[0]][path[1]] = errors;
        }
      } else {
        formattedErrors[issue.path[0]] = errors;
      }
    }
    return formattedErrors;
  }

  private static readableFieldName(path: (string | number)[]) {
    if (path.length === 0) return "This field";
    if (path.length === 1) return `The ${path[0]} field`;
    const last = path[path.length - 1];
    const parent = path
      .slice(0, -1)
      .map((part) => (typeof part === "number" ? `[${part}]` : part))
      .reduce((acc, part) => {
        if (part.startsWith("[")) {
          return acc.slice(0, -1) + part + " ";
        }
        return acc + " of " + part;
      });

    return `The ${last} of ${parent.trim()}`;
  }

  //  validate<S extends ValidationSchema>(schema: S): { [P in keyof S]: any }{
  //   return []
  //  }
}
