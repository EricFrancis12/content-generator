import mongoose from 'mongoose';
import { ESourceType, EContentType, EOutputType } from '../../_shared';

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
    outputType: {
        type: String,
        enum: Object.values(EOutputType),
        require: [true, 'Output history item must have a output type']
    },
    externalId: {
        type: String,
        require: [true, 'Output history item must have an externalId']
    },
    campaign_id: {
        type: String,
        require: [true, 'Output history item must have a campaign _id']
    },
    timestamp: {
        type: Number,
        require: [true, 'Output history item must have a timestamp']
    }
});

const OutputHistoryItem = mongoose.model('outputHistoryItem', outputHistoryItemSchema);
export default OutputHistoryItem;
