// routes/login_admin
const express = require('express');
const router = express.Router();
const loginAdminCrud = require('../crud/CRUDloginAdmin');


// LOGIN ADMIN
router.post('/get_login_admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await loginAdminCrud.search(username, password);
        
        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
