import { EOutputType } from '../../../../_shared';

export function timestampToLocaleDate(timestamp: number) {
    const localeString = new Date(timestamp).toLocaleString();
    return localeString.split(',')[0];
}

export function formatOutputType(outputType: EOutputType) {
    switch (outputType) {
        case EOutputType.KEEP_SAVED:
            return 'Saved To Files';
        case EOutputType.SEND_CONTENT_TO_TELEGRAM_CHANNEL:
            return 'Sent Content To Telegram Channel';
        case EOutputType.SEND_MESSAGE_TO_TELEGRAM_CHANNEL:
            return 'Sent Message To Telegram Channel';
        default:
            return '';
    }
}
