const fs = require('fs');

const SHARED_FILE_SYSTEM = './shared-file-system';

const FOLDERS = {
    KEEP_SAVED_CONTENT: `${SHARED_FILE_SYSTEM}/keep-saved-content`,
    OUTPUT_CONTENT: `${SHARED_FILE_SYSTEM}/output-content`,
    SOURCE_CONTENT: `${SHARED_FILE_SYSTEM}/source-content`,
    UPLOADED_CONTENT: `${SHARED_FILE_SYSTEM}/uploaded-content`,
    WIP_FILTERS_CONTENT: `${SHARED_FILE_SYSTEM}/WIP-filters-content`
};

const DIRS = [SHARED_FILE_SYSTEM, ...Object.values(FOLDERS)];
DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const sourceContent = [
    'Instagram',
    'Reddit',
    'TikTok',
    'YouTube'
];

const SOURCE_CONTENT_DIRS = sourceContent.map(item => {
    const dir = `${FOLDERS.SOURCE_CONTENT}/${item}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    return dir;
});

const dirsList = [
    FOLDERS.KEEP_SAVED_CONTENT,
    FOLDERS.OUTPUT_CONTENT,
    FOLDERS.UPLOADED_CONTENT,
    FOLDERS.WIP_FILTERS_CONTENT,
    ...SOURCE_CONTENT_DIRS
];
dirsList.forEach(dir => {
    const imagesDir = `${dir}/images`;
    const videosDir = `${dir}/videos`;
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);
});

const tempDir = `${FOLDERS.WIP_FILTERS_CONTENT}/temp`;
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
