const fs = require('fs');
const crypto = require('crypto');

const SERVICE_TOKEN = crypto.randomUUID();

const buildConfig = {
    SERVICE_TOKEN
};

const buildConfigPath = './services/_shared/build.config.json';

fs.writeFileSync(buildConfigPath, JSON.stringify(buildConfig), { encoding: 'utf8' });
