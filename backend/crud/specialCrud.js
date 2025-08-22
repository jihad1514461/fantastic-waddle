// backend/crud/specialCrud.js
const pool = require('../services/db'); // adjust path to your pool
const { parseJsonFieldsList, parseJsonFields, stringifyJsonFields } = require('../utils/jsonFieldHandler');

/**
 * Recursively build WHERE clause for nested conditions:
 * conditions are like:
 * [
 *   { logic: 'AND', conditions: [ { column, value, operator? }, { column, value } ] },
 *   { logic: 'OR',  conditions: [ ... ] }
 * ]
 * or flat:
 * [ { column, value, operator? }, { status: 'AND' }, { column, value } ]
 *
 * Supports JSON path 'basic_stats.hp' (uses JSON_EXTRACT)
 */
function buildWhereClauseRecursive(conditions) {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return { sql: '', params: [] };
  }

  const parts = [];
  const params = [];

  // If top-level is an object with logic + conditions, normalize to array
  const topIsGroup = conditions.length === 1 && conditions[0].logic && Array.isArray(conditions[0].conditions);
  const iter = topIsGroup ? conditions[0].conditions : conditions;

  // If it's nested groups, treat each entry
  for (const cond of iter) {
    if (cond.status && !cond.column && !cond.logic) {
      // legacy flat operator: { status: 'AND' }
      parts.push(cond.status.toUpperCase());
      continue;
    }

    if (cond.column) {
      const operator = cond.operator || '=';
      if (cond.column.includes('.')) {
        const [base, ...path] = cond.column.split('.');
        // JSON_EXTRACT returns JSON; use JSON_UNQUOTE to compare scalar values properly
        parts.push(`JSON_UNQUOTE(JSON_EXTRACT(??, '$.${path.join('.')}')) ${operator} ?`);
        params.push(base, cond.value);
      } else {
        parts.push(`?? ${operator} ?`);
        params.push(cond.column, cond.value);
      }
      continue;
    }

    if (cond.logic && Array.isArray(cond.conditions)) {
      // nested group: build recursively and wrap in parentheses
      const nested = buildWhereClauseRecursive(cond.conditions);
      if (nested.sql) {
        parts.push(`(${nested.sql})`);
        params.push(...nested.params);
      }
      // If top-level group had logic we will join later
      parts.push(cond.logic.toUpperCase());
    }
  }

  // Now join parts. If parts contains explicit AND/OR tokens, just join with space.
  // Otherwise default to AND
  let sql;
  const hasLogicToken = parts.some(p => p === 'AND' || p === 'OR');
  if (hasLogicToken) {
    sql = parts.join(' ');
  } else {
    sql = parts.join(' AND ');
  }

  // remove leading/trailing connectors if any
  sql = sql.replace(/^\s*(AND|OR)\s+/, '').replace(/\s+(AND|OR)\s*$/, '');

  return { sql, params };
}

/** ---------------- GET HELPERS ---------------- */
async function getByColumn(table, column, value) {
  const [rows] = await pool.query(`SELECT * FROM ?? WHERE ?? = ?`, [table, column, value]);
  return parseJsonFieldsList(table, rows);
}

async function getByConditions(table, conditions = []) {
  const whereClause = buildWhereClauseRecursive(conditions);
  const query = `SELECT * FROM ?? ${whereClause.sql ? 'WHERE ' + whereClause.sql : ''}`;
  const params = [table, ...whereClause.params];
  const [rows] = await pool.query(query, params);
  return parseJsonFieldsList(table, rows);
}

async function getUnion(tables, column) {
  if (!Array.isArray(tables) || tables.length < 2) throw new Error("Need at least two tables for UNION");
  const unionQueries = tables.map(() => `SELECT ?? FROM ??`).join(' UNION ');
  const params = [];
  tables.forEach(table => params.push(column, table));
  const [rows] = await pool.query(unionQueries, params);
  return rows;
}

async function getJoin(table1, table2, onCondition) {
  const query = `SELECT * FROM ?? JOIN ?? ON ${onCondition}`;
  const [rows] = await pool.query(query, [table1, table2]);
  // Note: we parse JSON columns for table1; join parsing per-table should be handled upstream or extended here.
  return parseJsonFieldsList(table1, rows);
}

/** ---------------- CREATE / DUPLICATE ---------------- */
async function createRow(table, data) {
  const dto = stringifyJsonFields(table, data);
  const [result] = await pool.query(`INSERT INTO ?? SET ?`, [table, dto]);
  // return newly created row parsed
  const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [table, result.insertId]);
  return parseJsonFields(table, rows[0]);
}

async function duplicateRow(table, id) {
  const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
  if (!rows || rows.length === 0) return null;
  const parsed = parseJsonFields(table, rows[0]);
  delete parsed.id;
  return createRow(table, parsed);
}

/** ---------------- UPDATE / DELETE ---------------- */
async function updateRows(table, conditions, newData) {
  const whereClause = buildWhereClauseRecursive(conditions || []);
  const dto = stringifyJsonFields(table, newData);
  const query = `UPDATE ?? SET ? ${whereClause.sql ? 'WHERE ' + whereClause.sql : ''}`;
  const params = [table, dto, ...whereClause.params];
  const [result] = await pool.query(query, params);
  return result.affectedRows;
}

async function deleteRows(table, conditions) {
  const whereClause = buildWhereClauseRecursive(conditions || []);
  const query = `DELETE FROM ?? ${whereClause.sql ? 'WHERE ' + whereClause.sql : ''}`;
  const params = [table, ...whereClause.params];
  const [result] = await pool.query(query, params);
  return result.affectedRows;
}

module.exports = {
  getByColumn,
  getByConditions,
  getUnion,
  getJoin,
  createRow,
  duplicateRow,
  updateRows,
  deleteRows
};
