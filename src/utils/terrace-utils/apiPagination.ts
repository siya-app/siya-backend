export async function paginatedResult<T>(
    fetchPage: (offset: number, limit: number) => Promise<T[]>,
    totalItems: number,
    limit: number = 100
): Promise<T[]> {
    const all: T[] = [];
    let offset = 0;

    while (offset < totalItems) {
        const page = await fetchPage(offset, limit);
        all.push(...page);
        offset += limit;

        await new Promise(resolve => setTimeout(resolve, 2000)); // optional rate limit
    }

    return all;
}