import cors from 'cors';
import express from 'express';
import campaignsRouter from './routes/campaigns/campaignsRouter';
import amqpRouter from './routes/amqp/amqpRouter';
import mongoose from 'mongoose';
import config from './config/config';
import { auth } from './middleware/auth';
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
app.use(cors());
app.use(express.json());

app.use('/api/v1/campaigns', auth, campaignsRouter);
app.use('/api/v1/amqp', auth, amqpRouter);

app.get('*', (req, res) => {
    const { protocol, hostname, path, query } = req;
    const queryString = Object.entries(query).map(entry => entry.join('=')).join('&');
    res.redirect(`${protocol}://${hostname}:3001${path}${queryString ? '?' : ''}${queryString}`);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Server running on port ${port}`));
