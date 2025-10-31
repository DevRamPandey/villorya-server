require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path');
const errorMiddleware = require("../middleware/errorMiddleware");
const connectDB = require('../config/database');
const authRoutes = require("../routes/authRoutes");
const adminRoutes = require("../routes/adminRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");
const leadRoutes = require("../routes/leadsRoutes");
const blogRoutes = require("../routes/blogsRoutes");
const packageSupplierRoutes = require("../routes/packageSupplierRoutes");
const rawSupplierRoutes = require("../routes/rawSupplierRoutes");
const cmsRoutes = require("../routes/cmsRoutes");
const questionsRoutes = require("../routes/questionsRoutes");
const rdRoutes = require("../routes/rdRoutes");
const kanbanRoutes = require("../routes/kanbanRoutes");
const contactRoutes = require("../routes/contactRoutes");
const productRoutes = require("../routes/productRoutes");
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve public folder
app.use(express.static(path.join(__dirname, 'public', )));

// Default route
// Serve index.html when '/' is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Auth Route
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/package-suppliers', packageSupplierRoutes);
app.use('/api/v1/raw-suppliers', rawSupplierRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/cms', cmsRoutes);
app.use('/api/v1/questions', questionsRoutes);
app.use("/api/v1/rd", rdRoutes);
app.use("/api/v1/kanban", kanbanRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/product", productRoutes);

// Error middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
