import { useEffect, useState } from 'react';

type SetValue<T> = T | ((val: T) => T);

export default function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void] {
    // Pass  initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(getValueFromLocalStorage(key) || initialValue);

    // useEffect to update local storage when the state changes
    useEffect(() => {
        const valueToStore =
            typeof storedValue === 'function'
                ? storedValue(storedValue)
                : storedValue;
        // Save state
        saveToLocalStorage(key, valueToStore);
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export function getValueFromLocalStorage(key: string) {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (err) {
        return null;
    }
}

export function saveToLocalStorage(key: string, value: string) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.log('Error saving to local storage');
    }
}
