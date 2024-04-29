import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

export type TColorMode = 'light' | 'dark';

export default function useColorMode() {
    const [colorMode, setColorMode] = useLocalStorage<TColorMode>('color-mode', 'light');

    useEffect(() => {
        const className: TColorMode = 'dark';
        const bodyClass = window.document.body.classList;

        colorMode === 'dark'
            ? bodyClass.add(className)
            : bodyClass.remove(className);
    }, [colorMode]);

    return [colorMode, setColorMode];
}
