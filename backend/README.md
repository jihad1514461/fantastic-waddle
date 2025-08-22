npm init -y
npm install express mysql2
npm install --save-dev nodemon

Alright — here’s a **README.md** that explains *all* the operations in your new **special CRUD** API, with request examples and expected behavior.

---

# **Special CRUD API – MySQL + Express.js**

This API provides **advanced CRUD** operations for MySQL tables, supporting:

* Dynamic GET queries (single column, multiple conditions, joins, unions)
* Create, update, delete with flexible conditions
* Duplicate rows by ID

## **Base URL**

```
http://localhost:3000/api
```

---

## **📌 GET Operations**

### 1. **Get by single column**

**Endpoint:**

```
GET /api/:table/:column/:value
```

**Example:**

```
GET /api/users/age/30
```

**SQL:**

```sql
SELECT * FROM users WHERE age = 30;
```

---

### 2. **Get by multiple conditions**

**Endpoint:**

```
POST /api/:table/query
```

**Body:**

```json
[
  { "age": 30, "status": ">" },
  { "status": "and" },
  { "name": "John", "status": "=" }
]
```

**SQL:**

```sql
SELECT * FROM users WHERE age > 30 AND name = 'John';
```

---

### 3. **Union of multiple tables**

**Endpoint:**

```
POST /api/union
```

**Body:**

```json
{
  "tables": ["users", "admins"],
  "column": "name"
}
```

**SQL:**

```sql
SELECT name FROM users
UNION
SELECT name FROM admins;
```

---

### 4. **Join multiple tables**

**Endpoint:**

```
POST /api/join
```

**Body:**

```json
{
  "table1": "users",
  "table2": "orders",
  "onCondition": "users.id = orders.user_id"
}
```

**SQL:**

```sql
SELECT * FROM users
JOIN orders ON users.id = orders.user_id;
```

---

## **📌 CREATE Operations**

### 5. **Insert new row**

**Endpoint:**

```
POST /api/:table/create
```

**Body:**

```json
{
  "name": "Alice",
  "age": 25
}
```

**SQL:**

```sql
INSERT INTO users (name, age) VALUES ('Alice', 25);
```

---

### 6. **Duplicate row by ID**

**Endpoint:**

```
POST /api/:table/duplicate/:id
```

**Example:**

```
POST /api/users/duplicate/5
```

**SQL:**

```sql
INSERT INTO users (name, age) 
SELECT name, age FROM users WHERE id = 5;
```

---

## **📌 UPDATE Operations**

### 7. **Update with conditions**

**Endpoint:**

```
PUT /api/:table
```

**Body:**

```json
{
  "conditions": [
    { "age": 30, "status": ">" },
    { "status": "and" },
    { "name": "John", "status": "=" }
  ],
  "newData": {
    "status": "active"
  }
}
```

**SQL:**

```sql
UPDATE users SET status = 'active'
WHERE age > 30 AND name = 'John';
```

---

## **📌 DELETE Operations**

### 8. **Delete with conditions**

**Endpoint:**

```
DELETE /api/:table
```

**Body:**

```json
[
  { "age": 30, "status": "<" },
  { "status": "or" },
  { "name": "Bob", "status": "=" }
]
```

**SQL:**

```sql
DELETE FROM users
WHERE age < 30 OR name = 'Bob';
```

---

## **📌 Condition JSON Format**

Conditions are always **arrays of objects**.

* If the object has both `"column": value` and `"status"`, `"status"` is interpreted as a **comparison operator** (`=`, `>`, `<`, `>=`, `<=`, `LIKE`, etc.).
* If the object has only `"status"`, it’s interpreted as a **logical operator** (`AND` / `OR`).

Example:

```json
[
  { "age": 30, "status": ">" },
  { "status": "and" },
  { "name": "John", "status": "=" }
]
```

→ Produces:

```sql
... WHERE age > 30 AND name = 'John';
```

---

## **📌 Notes**

* All SQL queries are parameterized to prevent SQL injection.
* Works with any MySQL table (must have an `id` column for duplication).
* You can extend this by adding pagination, sorting, or aggregation in `specialCrud.js`.

