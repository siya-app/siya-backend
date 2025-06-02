export function tagValidator(value, validType) {
    if (!Array.isArray(value))
        throw new Error("Must be an array");
    for (const tag of value) {
        const trimmedTag = typeof tag === 'string' ? tag.trim() : tag;
        if (!validType.includes(trimmedTag)) {
            throw new Error(`Invalid tag: ${tag}`);
        }
    }
}
//# sourceMappingURL=tagValidator.js.map