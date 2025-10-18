import { z } from "zod";

export function zodResolver<T extends z.ZodType>(schema: T) {
  return (values: any) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {};
    }

    const errors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    });

    return errors;
  };
}
