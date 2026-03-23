const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Content = require('../models/Content');
const User = require('../models/User');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.body.type === 'pdf' ? 'all data storage' : 'project data storage';
        cb(null, `data/${type}`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|zip|javascript|json|text/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('Only PDFs and ZIPs (for code) are allowed!'));
    }
});

// Get Platform Analytics
router.get('/analytics', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const pdfCount = await Content.countDocuments({ type: 'pdf' });
        const codeCount = await Content.countDocuments({ type: 'code' });
        const totalViews = await Content.aggregate([
            { $group: { _id: null, total: { $sum: "$views" } } }
        ]);

        res.json({
            students: totalUsers,
            views: totalViews[0]?.total || 0,
            pdfCount,
            codeCount,
            traffic: "High"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Publish Content with File Upload
router.post('/publish', upload.single('file'), async (req, res) => {
    const { title, description, type, category, size, language, isFree, price } = req.body;
    
    try {
        if (!req.file) throw new Error('File upload failed');

        const newContent = new Content({
            title,
            description,
            type,
            category,
            fileUrl: `/data/${type === 'pdf' ? 'all%20data%20storage' : 'project%20data%20storage'}/${req.file.filename}`,
            size: size || (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
            language,
            isFree: isFree === 'true' || isFree === true,
            price: Number(price) || 0
        });

        const savedContent = await newContent.save();
        res.status(201).json(savedContent);
    } catch (err) {
    }
});

// Get All Content for Admin Dashboard
router.get('/contents', async (req, res) => {
    try {
        const contents = await Content.find().sort({ createdAt: -1 });
        res.json(contents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Content
router.delete('/content/:id', async (req, res) => {
    try {
        const deletedContent = await Content.findByIdAndDelete(req.params.id);
        if (!deletedContent) return res.status(404).json({ message: 'Content not found' });
        res.json({ message: 'Content deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Price
router.put('/content/:id/price', async (req, res) => {
    try {
        const { isFree, price } = req.body;
        const updatedContent = await Content.findByIdAndUpdate(
            req.params.id,
            { isFree, price: Number(price) || 0 },
            { new: true }
        );
        if (!updatedContent) return res.status(404).json({ message: 'Content not found' });
        res.json(updatedContent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
