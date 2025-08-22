const pool = require('../services/db');
async function search(username, password) {
    const [rows] = await pool.query(
    `SELECT * FROM login_admin WHERE username = ? AND password = ? LIMIT 1`,
    [username, password]);
    if (rows.length === 0) {
        return null;
    } else {
        return rows[0];
    }
}

module.exports = { search };