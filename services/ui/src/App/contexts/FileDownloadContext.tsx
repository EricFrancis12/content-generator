import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';
import { selectauthToken } from '../store/reducers/authTokenReducer';

export type TFileDownload = {
    name: string,
    endpoint: string
};
export type TFileDownloadContext = {
    downloadFileFromEndpoint: ({ endpoint, name }: { endpoint: string, name?: string }, arg2?: any) => any,
    downloading: boolean,
    progress: number
};

const FileDownloadContext = React.createContext<TFileDownloadContext | null>(null);

export function useFileDownloadContext() {
    const context = useContext(FileDownloadContext);
    if (!context) {
        throw new Error('useFileDownloadContext must be used within a FileDownloadContext provider');
    }
    return context;
}

export function FileDownloadProvider({ children }: {
    children: React.ReactNode
}) {
    const { value: authToken } = useAppSelector(selectauthToken);

    const [fileDownload, setFileDownload] = useState<TFileDownload | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    async function downloadFileFromEndpoint(
        { endpoint, name = 'file' }: { endpoint: string, name?: string },
        { includeAuthToken = true }: { includeAuthToken?: boolean } = {}
    ) {
        if (downloading) return;
        if (includeAuthToken === true && !authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        setFileDownload({ endpoint, name });
        setDownloading(true);
        setProgress(0);
        try {
            const options = includeAuthToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
            const res = await fetch(endpoint, options);
            if (!res.ok) {
                toast.error('Failed to download file');
                return;
            }

            const contentLength = parseInt(res?.headers?.get('Content-Length') || '0');
            const reader = res?.body?.getReader();

            if (contentLength && reader) {
                let loaded = 0;
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    loaded += value.length;
                    const percentage = (loaded / contentLength) * 100;
                    setProgress(percentage);
                }
            }

            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            setFileDownload(null);
            setDownloading(false);
            setProgress(0);
            console.log(err);
            toast.error('Error downloading file');
        }
    }

    const value: TFileDownloadContext = {
        downloadFileFromEndpoint,
        downloading,
        progress
    };

    return (
        <FileDownloadContext.Provider value={value}>
            <DownloadProgress
                name={fileDownload?.name || ''}
                progress={progress}
                hidden={!downloading}
            />
            {children}
        </FileDownloadContext.Provider>
    )
}

function DownloadProgress({ name, progress, hidden }: {
    name: string,
    progress: number,
    hidden?: boolean
}) {
    return hidden
        ? <></>
        : (
            <div
                className='absolute flex flex-col justify-center items-center gap-2 p-2 bg-slate-200 border rounded-md'
                style={{
                    top: '5%',
                    right: '5%',
                    minWidth: '10%'
                }}
            >
                <div>{`Downloading ${name}`}</div>
                <div className='h-[20px] w-full bg-white overflow-hidden'>
                    <div
                        className='h-full w-full bg-blue-400'
                        style={{
                            width: `${progress}%`
                        }}
                    />
                </div>
            </div>
        )
}
