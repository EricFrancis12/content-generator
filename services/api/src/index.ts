import cors from 'cors';
import express from 'express';
import apiRouter from './routes/api/apiRouter';
import mongoose from 'mongoose';
import { logger } from './config/loggers';
import _shared from '../_shared';
const { consoleLogger } = _shared.loggers;
import config from './config/config';
const { MONGO_IP, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } = config;

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    const timeout = 5000;
    mongoose
        .connect(mongoUrl)
        .then(() => logger.info('Connected to DB'))
        .catch(() => {
            consoleLogger.error(`Error connecting to Moongo DB. Trying again in ${(timeout / 1000).toFixed(0)} seconds.`);
            setTimeout(connectWithRetry, timeout);
        });
}
connectWithRetry();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.get('*', (req, res) => {
    const { protocol, hostname, path, query } = req;
    const queryString = Object.entries(query).map(entry => entry.join('=')).join('&');
    res.redirect(`${protocol}://${hostname}:3001${path}${queryString ? '?' : ''}${queryString}`);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
    if (process.env.NODE_ENV === 'development') {
        logger.info('~ NOTICE: Auth middleware and other security features are disabled while running in development mode.');
    }
});
