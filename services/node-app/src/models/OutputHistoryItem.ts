import mongoose from 'mongoose';
import { ESourceType, EContentType } from '../../_shared';

export const outputHistoryItemSchema = new mongoose.Schema({
    sourceType: {
        type: String,
        enum: Object.values(ESourceType),
        require: [true, 'Output history item must have a source type']
    },
    contentType: {
        type: String,
        enum: Object.values(EContentType),
        require: [true, 'Output history item must have a content type']
    },
    externalId: {
        type: String,
        require: [true, 'Output history item must have an externalId']
    },
    campaign_id: {
        type: String,
        require: [true, 'Output history item must have a campaign _id']
    },
    outputType: {
        type: String,
        require: [true, 'Output history item must have a output type']
    },
    timestamp: {
        type: Number,
        require: [true, 'Output history item must have a timestamp']
    }
});

const OutputHistoryItem = mongoose.model('outputHistoryItem', outputHistoryItemSchema);
export default OutputHistoryItem;
