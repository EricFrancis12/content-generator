import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { _storeSelector } from '../store/store';
import { IIntakeHistoryItem, IOutputHistoryItem } from '../../_shared';

export type THistoryType = 'intake' | 'output';

export default function useCampaignHistory(campaign_id?: string, type: THistoryType = 'intake') {
    const authToken = _storeSelector(state => state.authToken).value;

    const [history, setHistory] = useState<IIntakeHistoryItem[] | IOutputHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        if (!campaign_id) return;
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        const { protocol, hostname } = window.location;
        const endpoint = `${protocol}//${hostname}:3000/api/v1/campaigns/${campaign_id}/${type === 'intake' ? 'intake-history' : 'output-history'}`;

        setLoading(true);
        fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            signal: controller.signal
        })
            .then(res => res.json())
            .then(resJson => {
                const _history = type === 'intake'
                    ? resJson?.data?.intakeHistory as IIntakeHistoryItem[]
                    : resJson?.data?.outputHistory as IOutputHistoryItem[];
                if (_history) {
                    setHistory(_history);
                } else {
                    toast.error('Error fetching History');
                }
            })
            .catch(err => {
                if (typeof err === 'string' && err === 'AbortError') return;
                toast.error('Error fetching History');
            })
            .finally(() => setLoading(false));

        return () => {
            setLoading(false);
            controller.abort('AbortError');
        };
    }, [campaign_id, authToken, type]);

    if (type === 'intake') {
        const result: {
            history: IIntakeHistoryItem[],
            setHistory: React.Dispatch<React.SetStateAction<IIntakeHistoryItem[]>>,
            loading: boolean,
            setLoading: React.Dispatch<React.SetStateAction<boolean>>
        } = {
            history,
            setHistory,
            loading,
            setLoading
        };
        return result;
    } else {
        const result: {
            history: IOutputHistoryItem[],
            setHistory: React.Dispatch<React.SetStateAction<IOutputHistoryItem[]>>,
            loading: boolean,
            setLoading: React.Dispatch<React.SetStateAction<boolean>>
        } = {
            history: history as IOutputHistoryItem[],
            setHistory: setHistory as React.Dispatch<React.SetStateAction<IOutputHistoryItem[]>>,
            loading,
            setLoading
        };
        return result;
    }
}
