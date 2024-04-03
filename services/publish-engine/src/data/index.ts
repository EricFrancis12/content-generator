import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { IOutputHistoryItem } from '../../_shared';
import config from '../config/config';
const { TELEGRAM_BOT_TOKEN } = config;

export async function addToOutputHistory(outputHistoryItem: IOutputHistoryItem) {
    const { campaign_id } = outputHistoryItem;
    try {
        const res = await axios.post(`http://node-app:3000/api/v1/campaigns/${campaign_id}/output-history`, outputHistoryItem);
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function sendMessageToTelegramChannel(chatId: string, message: string) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('Invalid or missing telegram bot token');
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('text', message);

        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return true
    } catch (err) {
        console.error('err');
        return false;
    }
}


export async function sendImageToTelegramChannel(chatId: string, path: string) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('Invalid or missing telegram bot token');
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', fs.createReadStream(path))

        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function sendVideoToTelegramChannel(chatId: string, path: string) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('Invalid or missing telegram bot token');
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('video', fs.createReadStream(path))

        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
