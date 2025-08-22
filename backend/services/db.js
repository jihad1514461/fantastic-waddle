// services/db.js
const mysql = require('mysql2/promise');
const { pool } = require('../config/database');


module.exports = pool;
