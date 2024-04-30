import { useEffect } from 'react';
import { selectColorMode } from '../store/reducers/colorModeReducer';
import { useAppSelector } from '../store/hooks';
import { saveToLocalStorage } from './useLocalStorage';

export type TColorMode = 'light' | 'dark';

export default function useColorMode() {
    const colorMode = useAppSelector(selectColorMode).value;

    useEffect(() => {
        const className: TColorMode = 'dark';
        const bodyClass = window.document.body.classList;

        colorMode === 'dark'
            ? bodyClass.add(className)
            : bodyClass.remove(className);

        saveToLocalStorage('color-mode', colorMode);
    }, [colorMode]);
}
