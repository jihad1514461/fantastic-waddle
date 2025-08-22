// server.js
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const app = express();
const basicRoute = require('./routes/basicRoute');
const specialRoutes = require('./routes/specialRoutes');
const loginAdminRoute = require('./routes/login_admin');

// Enable CORS for frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

//Specific Crud Operations
app.use('/api', loginAdminRoute);
// Generic CRUD
app.use('/api', basicRoute);

// Special/custom routes
app.use('/api', specialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
const PORT = 3000;

// Test database connection before starting server
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
