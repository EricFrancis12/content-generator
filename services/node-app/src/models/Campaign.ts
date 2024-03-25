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
    downloadHistory: [String],
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
    filters: [
        {
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
                content_id: {
                    type: String
                },
                filterIndex: {
                    type: Number
                }
            },
            ingredient: {
                type: {
                    type: String,
                    enum: Object.values(EFilterComponentType),
                    require: [true, 'Filter ingredient must have a type']
                },
                content_id: String,
                filterIndex: Number
            },
            options: {}
        }
    ],
    publishTo: [
        {
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
        }
    ]
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
