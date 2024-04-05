import util from 'util';
const exec = util.promisify(require('child_process').exec);

type TArg = {
    stdout: string,
    stderr: string
};

const executeCommand = async (cmd: string): Promise<number | null> => {
    try {
        return await exec(cmd, { timeout: 2000 }).then(async ({ stdout, stderr }: TArg) => {
            if (stderr) {
                return null;
            }
            if (stdout) {
                return stdout;
            }
        });
    } catch (cmdErr) {
        return null;
    }
};

const getFileDate = async (filePath: string): Promise<number | null> => {
    try {
        let cmd = '';
        if (process.platform === 'linux') {
            cmd = `stat -c %Y "${filePath}"`;
        } else if (process.platform === 'darwin') {
            cmd = `stat -s "${filePath}"`;
        } else {
            console.error(`getFileDate() => Error: only 'linux' and 'darwin' platforms are supported`);
            return null;
        }

        let getDateResult = await executeCommand(cmd);
        if (getDateResult === null) {
            return null;
        }

        if (process.platform === 'linux') {
            getDateResult = parseInt(`${getDateResult}`);
            return getDateResult;
        }
    } catch (err) {
        console.error(`getFileDate() => ${err}`);
        return null;
    }
    return null;
};

export default getFileDate;
