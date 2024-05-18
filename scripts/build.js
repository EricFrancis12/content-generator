const fs = require('fs');
const crypto = require('crypto');

const buildConfigPath = './services/_shared/build.config.json';
const defaultBuildConfigPath = './services/_shared/build.config.default.json';

const defaultBuildConfig = fs.existsSync(defaultBuildConfigPath) ? JSON.parse(fs.readFileSync(defaultBuildConfigPath)) : {};

const buildConfig = {
    ...defaultBuildConfig,
    SERVICE_TOKEN: crypto.randomUUID()
};

fs.writeFileSync(buildConfigPath, JSON.stringify(buildConfig), { encoding: 'utf8' });
console.log(`Build config file created at ${buildConfigPath}`);
