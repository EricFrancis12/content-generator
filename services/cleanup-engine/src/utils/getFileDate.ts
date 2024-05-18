import { exec } from 'child_process';
import { logger, formatErr } from '../config/loggers';

type TArg = {
    stdout: string,
    stderr: string
};

const executeCommand = async (cmd: string): Promise<string | null> => {
    try {
        const { stdout, stderr } = await new Promise<TArg>((resolve, reject) => {
            exec(cmd, { timeout: 2000 }, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });

        if (stderr) {
            return null;
        }
        if (stdout) {
            return stdout;
        }
    } catch (err) {
        logger.error(formatErr(err));
    }
    return null;
};

const getFileDate = async (filePath: string): Promise<number | null> => {
    try {
        let cmd = '';
        if (process.platform === 'linux') {
            cmd = `stat -c %Y "${filePath}"`;
        } else if (process.platform === 'darwin') {
            cmd = `stat -s "${filePath}"`;
        } else {
            throw new Error(`getFileDate() => Error: only 'linux' and 'darwin' platforms are supported`);
        }

        const getDateResult = await executeCommand(cmd);
        if (getDateResult && process.platform === 'linux') {
            const unixTimestamp = parseInt(getDateResult);
            return unixTimestamp || null;
        }
    } catch (err) {
        logger.error(formatErr(err));
    }
    return null;
};

export default getFileDate;
