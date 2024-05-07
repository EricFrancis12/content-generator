

export function frontFillRestOfArrayUpTo<T>(arr: T[], fillItem: T, length: number): T[] {
    if (arr.length >= length) return arr;
    // Copying the array, then filling it with fillItem from the front, stopping when it reaches length
    const fillItems = Array(length - arr.length);
    fillItems.fill(fillItem);
    return [...fillItems, ...arr];
}
