import { useRef, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useAppSelector } from '../store/hooks';
import { selectauthToken } from '../store/reducers/authTokenReducer';

export default function usePollEndpoint(
    endpoint: string,
    ms: number,
    callback: (res: AxiosResponse) => any,
    onError: (err: AxiosError) => any = () => { }
) {
    const { value: authToken } = useAppSelector(selectauthToken);

    const poller = useRef(new Clock(fetchEndpoint, ms));

    useEffect(() => {
        poller.current.start();
        return () => poller.current.stop();
    }, [poller]);

    function fetchEndpoint() {
        if (!authToken) return;

        axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(callback)
            .catch();
    }

    function start() {
        poller.current.start();
    }

    function stop() {
        poller.current.stop();
    }

    return {
        start,
        stop
    };
}

class Clock {
    callback: Function;
    ms: number;
    intervalId: number | null;

    constructor(callback: Function, ms: number) {
        this.callback = callback;
        this.ms = ms;
        this.intervalId = null;
    }

    start() {
        if (!this.intervalId) {
            this.intervalId = setInterval(this.callback, this.ms);
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
