// backend/utils/jsonFieldHandler.js
/**
 * Which columns are JSON for each table. Extend this map as needed.
 */
const jsonColumns = {
  monsters: [
    'basic_skill_ids',
    'basic_stats',
    'element_mastery',
    'element_resistance',
    'drop_item_ids'
  ],
  skills: [
    'basic_stats',
    'requirement_stats',
    'element_mastery',
    'element_resistance'
  ],
  // add more table entries here
};

/**
 * Parse JSON fields on a row
 */
function parseJsonFields(table, row) {
  if (!row) return row;
  const cols = jsonColumns[table] || [];
  const parsed = { ...row };

  cols.forEach(col => {
    if (parsed[col] && typeof parsed[col] === 'string') {
      try {
        parsed[col] = JSON.parse(parsed[col]);
      } catch (err) {
        parsed[col] = null;
        console.warn(`Failed to parse JSON column ${col} in table ${table}:`, err.message);
      }
    }
  });

  return parsed;
}

/**
 * Parse list
 */
function parseJsonFieldsList(table, rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map(r => parseJsonFields(table, r));
}

/**
 * Stringify data before insert/update
 */
function stringifyJsonFields(table, row) {
  if (!row) return row;
  const cols = jsonColumns[table] || [];
  const dto = { ...row };
  cols.forEach(col => {
    if (dto[col] !== undefined && typeof dto[col] !== 'string') {
      try {
        dto[col] = JSON.stringify(dto[col]);
      } catch (err) {
        dto[col] = null;
        console.warn(`Failed to stringify ${col} for table ${table}:`, err.message);
      }
    }
  });
  return dto;
}

module.exports = {
  jsonColumns,
  parseJsonFields,
  parseJsonFieldsList,
  stringifyJsonFields
};
