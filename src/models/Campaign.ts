import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Campaign must have a name']
    }
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
