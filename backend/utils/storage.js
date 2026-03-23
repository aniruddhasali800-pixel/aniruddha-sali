const fs = require('fs-extra');
const path = require('path');

const UPLOAD_DIRS = {
    pdf: path.join(__dirname, '../data/all data storage'),
    code: path.join(__dirname, '../data/project data storage')
};

const ensureDirs = async () => {
    try {
        await fs.ensureDir(UPLOAD_DIRS.pdf);
        await fs.ensureDir(UPLOAD_DIRS.code);
        console.log('✅ Upload directories verified');
    } catch (err) {
        console.error('❌ Failed to create upload directories:', err);
    }
};

module.exports = { UPLOAD_DIRS, ensureDirs };
