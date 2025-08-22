const fs = require('fs');
const path = require('path');

function getTablePath(tableName) {
    return path.join(__dirname, '../data', `${tableName}.json`);
}

function readTable(tableName) {
    const filePath = getTablePath(tableName);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeTable(tableName, data) {
    const filePath = getTablePath(tableName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function generateId(tableName) {
    const table = readTable(tableName);
    return table.length ? Math.max(...table.map(item => item.id)) + 1 : 1;
}

module.exports = { readTable, writeTable, generateId };
