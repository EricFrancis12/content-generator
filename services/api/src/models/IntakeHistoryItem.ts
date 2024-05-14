import mongoose from 'mongoose';
import { ESourceType, EContentType } from '../../_shared';

export const intakeHistoryItemSchema = new mongoose.Schema({
    sourceType: {
        type: String,
        enum: Object.values(ESourceType),
        require: [true, 'Intake history item must have a source type']
    },
    contentType: {
        type: String,
        enum: Object.values(EContentType),
        require: [true, 'Intake history item must have a content type']
    },
    externalId: {
        type: String,
        require: [true, 'Intake history item must have an externalId']
    },
    campaign_id: {
        type: String,
        require: [true, 'Intake history item must have a campaign _id']
    },
    timestamp: {
        type: Number,
        require: [true, 'Intake history item must have a timestamp']
    }
});

const IntakeHistoryItem = mongoose.model('IntakeHistoryItem', intakeHistoryItemSchema);
export default IntakeHistoryItem;
