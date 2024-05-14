import multer from 'multer';
import _shared, { EImageFileExtension, EVideoFileExtension } from '../../_shared'
const { generateInternalId, getFileExt } = _shared.utils;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileExt = getFileExt(file.originalname);
        if (fileExt in EImageFileExtension) {
            cb(null, './shared-file-system/uploaded-content/images');
        } else if (fileExt in EVideoFileExtension) {
            cb(null, './shared-file-system/uploaded-content/videos');
        } else {
            cb(new Error('Unsupported file type'), '');
        }
    },
    filename: function (req, file, cb) {
        const fileExt = getFileExt(file.originalname);
        const internalId = generateInternalId();
        const newFilename = `${internalId}.${fileExt}`;
        cb(null, newFilename);
    }
});

const upload = multer({ storage });
export default upload;
