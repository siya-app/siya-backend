import { z } from "zod";

export function typeValidator(type: any) {
return (type.options as z.ZodLiteral<any>[])
    .filter((v): v is z.ZodLiteral<string> => v instanceof z.ZodLiteral)
    .map((v) => v.value);
}