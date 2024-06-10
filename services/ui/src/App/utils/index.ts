import axios from 'axios';
import type { TPagination } from '../typings';
import _shared, { ESourceType } from '../../_shared';
const { formatErr } = _shared.utils;

export type { TPagination } from '../typings';
export { formatErr };

export function apiURL(path: string): string {
    const { protocol, hostname } = window.location;
    const port = process.env.NODE_ENV === 'development' ? ':3000' : '';
    return `${protocol}//${hostname}${port}${path}`;
}

export function generatePagination({ currentPage, totalPages }: {
    currentPage: number,
    totalPages: number
}): TPagination[] {
    let result: TPagination[] = [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ];

    if (totalPages <= 7) {
        result = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
        result = [1, 2, 3, '...', totalPages - 1, totalPages];
    } else if (currentPage >= totalPages - 2) {
        result = [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [
        '<<',
        '<',
        ...result,
        '>',
        '>>'
    ];
}

export function localeSourceType(sourceType: ESourceType) {
    switch (sourceType) {
        case ESourceType.READ_FROM_SAVED:
            return 'Read From Saved';
        case ESourceType.INSTAGRAM:
            return 'Instagram Account';
        case ESourceType.REDDIT:
            return 'Subreddit';
        case ESourceType.TIKTOK:
            return 'TikTok Account';
        case ESourceType.YOUTUBE:
            return 'YouTube Channel';
        default:
            return '';
    }
}

export function sendLogToApi(logLevel: 'error' | 'info', message: string) {
    const { protocol, hostname } = window.location;
    const endpoint = `${protocol}//${hostname}:3000/api/v1/services/ui/logs/${logLevel}`;
    axios.post(endpoint, { message })
        .catch(err => { });
}
