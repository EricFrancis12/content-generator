import express from 'express';
import campaignsRouter from './routes/campaigns/campaignsRouter';
import amqpRouter from './routes/amqp/amqpRouter';
import mongoose from 'mongoose';
import config from './config/config';
const { MONGO_IP, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } = config;

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
        .connect(mongoUrl)
        .then(() => console.log('Connected to DB'))
        .catch(err => {
            console.error(err);
            setTimeout(connectWithRetry, 5000);
        });
}
connectWithRetry();

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('GET @ ./');
});

app.use('/api/v1/campaigns', campaignsRouter);
app.use('/api/v1/amqp', amqpRouter);

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
