// routes/specialRoutes.js
const express = require('express');
const router = express.Router();
const specialCrud = require('../crud/specialCrud');

/**
 * ---------------- GET METHODS ----------------
 */

// GET by single column: /api/:table/:column/:value
router.get('/:table/:column/:value', async (req, res) => {
    const { table, column, value } = req.params;
    try {
        const rows = await specialCrud.getByColumn(table, column, value);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET with multiple conditions (POSTed JSON array)
router.post('/:table/query', async (req, res) => {
    const { table } = req.params;
    const conditions = req.body;
    try {
        const rows = await specialCrud.getByConditions(table, conditions);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET union of multiple tables
router.post('/union', async (req, res) => {
    const { tables, column } = req.body;
    try {
        const rows = await specialCrud.getUnion(tables, column);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET join of multiple tables
router.post('/join', async (req, res) => {
    const { table1, table2, onCondition } = req.body;
    try {
        const rows = await specialCrud.getJoin(table1, table2, onCondition);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * ---------------- CREATE METHODS ----------------
 */

// CREATE new row
router.post('/:table/create', async (req, res) => {
    const { table } = req.params;
    const data = req.body;
    try {
        const newItem = await specialCrud.createRow(table, data);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DUPLICATE a row by ID
router.post('/:table/duplicate/:id', async (req, res) => {
    const { table, id } = req.params;
    try {
        const duplicated = await specialCrud.duplicateRow(table, id);
        if (!duplicated) return res.status(404).json({ message: "Row not found" });
        res.status(201).json(duplicated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * ---------------- UPDATE METHODS ----------------
 */

// UPDATE with conditions
router.put('/:table', async (req, res) => {
    const { table } = req.params;
    const { conditions, newData } = req.body; 
    // { conditions: [...], newData: {...} }
    try {
        const updated = await specialCrud.updateRows(table, conditions, newData);
        res.json({ updatedCount: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * ---------------- DELETE METHODS ----------------
 */

// DELETE with conditions
router.delete('/:table', async (req, res) => {
    const { table } = req.params;
    const conditions = req.body;
    try {
        const deletedCount = await specialCrud.deleteRows(table, conditions);
        res.json({ deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
