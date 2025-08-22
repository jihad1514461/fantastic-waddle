// routes/basicRoutes.js
const express = require('express');
const router = express.Router();
const basicCrud = require('../crud/crud');

// READ all
router.get('/:table', async (req, res) => {
    try {
        res.json(await basicCrud.getAll(req.params.table));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ one
router.get('/:table/:id', async (req, res) => {
    try {
        const item = await basicCrud.getById(req.params.table, req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE
router.post('/:table', async (req, res) => {
    try {
        const newItem = await basicCrud.create(req.params.table, req.body);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
router.put('/:table/:id', async (req, res) => {
    try {
        const success = await basicCrud.update(req.params.table, req.params.id, req.body);
        if (!success) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:table/:id', async (req, res) => {
    try {
        const success = await basicCrud.remove(req.params.table, req.params.id);
        if (!success) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
