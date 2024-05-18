const fs = require('fs');

const SHARED_FILE_SYSTEM = './shared-file-system';
const SHARED_FILE_SYSTEM_FOLDERS = {
    KEEP_SAVED_CONTENT: `${SHARED_FILE_SYSTEM}/keep-saved-content`,
    OUTPUT_CONTENT: `${SHARED_FILE_SYSTEM}/output-content`,
    SOURCE_CONTENT: `${SHARED_FILE_SYSTEM}/source-content`,
    UPLOADED_CONTENT: `${SHARED_FILE_SYSTEM}/uploaded-content`,
    WIP_FILTERS_CONTENT: `${SHARED_FILE_SYSTEM}/WIP-filters-content`
};

const LOGS = './logs';
const LOGS_FOLDERS = {
    API: `${LOGS}/api`,
    APPLY_FILTERS_ENGINE: `${LOGS}/apply-filters-engine`,
    CAMPAIGN_ENGINE: `${LOGS}/campaign-engine`,
    CLEANUP_ENGINE: `${LOGS}/cleanup-engine`,
    DOWNLOAD_ENGINE: `${LOGS}/download-engine`,
    PUBLISH_ENGINE: `${LOGS}/publish-engine`,
    UI: `${LOGS}/ui`
};

const DIRS = [
    SHARED_FILE_SYSTEM,
    ...Object.values(SHARED_FILE_SYSTEM_FOLDERS),
    LOGS,
    ...Object.values(LOGS_FOLDERS)
];
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
    const dir = `${SHARED_FILE_SYSTEM_FOLDERS.SOURCE_CONTENT}/${item}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    return dir;
});

const sourceContentDirsList = [
    SHARED_FILE_SYSTEM_FOLDERS.KEEP_SAVED_CONTENT,
    SHARED_FILE_SYSTEM_FOLDERS.OUTPUT_CONTENT,
    SHARED_FILE_SYSTEM_FOLDERS.UPLOADED_CONTENT,
    SHARED_FILE_SYSTEM_FOLDERS.WIP_FILTERS_CONTENT,
    ...SOURCE_CONTENT_DIRS
];
sourceContentDirsList.forEach(dir => {
    const imagesDir = `${dir}/images`;
    const videosDir = `${dir}/videos`;
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);
});

const tempDir = `${SHARED_FILE_SYSTEM_FOLDERS.WIP_FILTERS_CONTENT}/temp`;
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
