const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['pdf', 'code'], required: true },
    category: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    fileUrl: { type: String, required: true },
    size: { type: String },
    language: { type: String }, // For code repositories
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
