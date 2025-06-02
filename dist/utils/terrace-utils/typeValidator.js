import { z } from "zod";
export function typeValidator(type) {
    return type.options
        .filter((v) => v instanceof z.ZodLiteral)
        .map((v) => v.value);
}
//# sourceMappingURL=typeValidator.js.map