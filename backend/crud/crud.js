// crud/basicCrud.js
const pool = require('../services/db');

// Get all rows from a table
async function getAll(table) {
    const [rows] = await pool.query(`SELECT * FROM ??`, [table]);
    return rows;
}

// Get one row by ID
async function getById(table, id) {
    const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
    return rows[0];
}

// Insert a new row
async function create(table, data) {
    const [result] = await pool.query(`INSERT INTO ?? SET ?`, [table, data]);
    return { id: result.insertId, ...data };
}

// Update a row
async function update(table, id, data) {
    const [result] = await pool.query(`UPDATE ?? SET ? WHERE id = ?`, [table, data, id]);
    return result.affectedRows > 0;
}

// Delete a row
async function remove(table, id) {
    const [result] = await pool.query(`DELETE FROM ?? WHERE id = ?`, [table, id]);
    return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
