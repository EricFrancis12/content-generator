import mongoose from 'mongoose';
import typings from '../typings/index';
const { ESourceType, EContentType, EFilterComponentType, EPublisherType } = typings;

export const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Campaign must have a name']
    },
    disabled: {
        type: Boolean,
        default: () => false
    },
    options: {
        minVideoLength: Number,
        maxVideoLength: Number,
        shortVideosOnly: Boolean,
        longVideosOnly: Boolean    
    },
    intakeHistory: [{
        externalId: {
            type: String,
            require: [true, 'Intake history item must have an externalId']
        }
    }],
    outputHistory: [{
        externalId: {
            type: String,
            require: [true, 'Output history item must have an externalId']
        }
    }],
    source: {
        type: {
            type: String,
            enum: Object.values(ESourceType),
            require: [true, 'Campaign must have a source type']
        },
        contentType: {
            type: String,
            enum: Object.values(EContentType),
            require: [true, 'Campaign must have a content type']
        },
        externalId: {
            type: String,
            require: [true, 'Campaign must have an external id']
        }
    },
    filters: [{
        name: {
            type: String,
            require: [true, 'Filter must have a name']
        },
        base: {
            type: {
                type: String,
                enum: Object.values(EFilterComponentType),
                require: [true, 'Filter base must have a type']
            },
            contentType: {
                type: String,
                enum: Object.values(EContentType),
                require: [true, 'Filter base must have a content type']
            },
            internalId: String,
            filterIndex: Number
        },
        ingredient: {
            type: {
                type: String,
                enum: Object.values(EFilterComponentType),
                require: [true, 'Filter ingredient must have a type']
            },
            contentType: {
                type: String,
                enum: Object.values(EContentType),
                require: [true, 'Filter ingredient must have a content type']
            },
            internalId: String,
            filterIndex: Number
        },
        options: {}
    }],
    publishTo: [{
        type: {
            type: String,
            enum: Object.values(EPublisherType),
            require: [true, 'Publisher must have a type']
        },
        externalId: {
            type: String,
            require: [true, 'Publisher must have an external id']
        },
        disabled: Boolean
    }]
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
