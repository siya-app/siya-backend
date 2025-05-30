export function tagValidator(value: any, validType: string[]) {
    if (!Array.isArray(value)) throw new Error("Must be an array");
    for (const tag of value) {
        if (!validType.includes(tag)) {
            throw new Error(`Invalid tag: ${tag}`);
        }
    }
}