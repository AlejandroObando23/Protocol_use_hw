const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Notebook = require("./models/insect");

const mongoURI = process.env.MONGODB_URI || "mongodb+srv://root123:root123@cluster0.0s6q0vr.mongodb.net/?appName=Cluster0";

let cachedConnectionPromise = null;

async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    if (!cachedConnectionPromise) {
        console.log("Iniciando conexión a MongoDB...");
        cachedConnectionPromise = mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        }).then(async (m) => {
            console.log("System connected to MongoDB.");
            // Solo sembrar la base de datos si corremos de forma local (no en Vercel)
            if (!process.env.VERCEL) {
                await seedNotebooks();
            }
            return m;
        }).catch((err) => {
            cachedConnectionPromise = null; // Reiniciar si falla
            throw err;
        });
    }
    await cachedConnectionPromise;
}

// Seed data function
async function seedNotebooks() {
    try {
        // Clear collection to ensure we have exactly 20 clean records with the new fields
        await Notebook.deleteMany({});
        console.log("Cleared existing notebook collection.");

        const initialNotebooks = [
          { "id": 1, "name": "Classic Grid Notebook", "type": "Grid", "size_leaves": "100", "cost": "$2.50", "brand": 1 },
          { "id": 2, "name": "Premium Leather Journal", "type": "Lined", "size_leaves": "200", "cost": "$12.99", "brand": 2 },
          { "id": 3, "name": "Sketch Book Pro", "type": "Blank", "size_leaves": "120", "cost": "$8.50", "brand": 1 },
          { "id": 4, "name": "Pocket Memo Notepad", "type": "Lined", "size_leaves": "50", "cost": "$1.20", "brand": 3 },
          { "id": 5, "name": "Bullet Journal Edition", "type": "Dotted", "size_leaves": "160", "cost": "$15.00", "brand": 2 },
          { "id": 6, "name": "Standard College Notebook", "type": "Lined", "size_leaves": "150", "cost": "$3.00", "brand": 1 },
          { "id": 7, "name": "Mini Spiral Notepad", "type": "Grid", "size_leaves": "60", "cost": "$0.99", "brand": 3 },
          { "id": 8, "name": "Heavyweight Watercolor Pad", "type": "Blank", "size_leaves": "40", "cost": "$9.99", "brand": 4 },
          { "id": 9, "name": "Reporter Style Pad", "type": "Lined", "size_leaves": "80", "cost": "$2.20", "brand": 3 },
          { "id": 10, "name": "Architecture Grid Notebook", "type": "Grid", "size_leaves": "180", "cost": "$7.50", "brand": 1 },
          { "id": 11, "name": "Eco-Friendly Recycled Book", "type": "Lined", "size_leaves": "100", "cost": "$4.50", "brand": 5 },
          { "id": 12, "name": "Music Manuscript Book", "type": "Staff", "size_leaves": "96", "cost": "$5.00", "brand": 4 },
          { "id": 13, "name": "Hardcover Executive Journal", "type": "Lined", "size_leaves": "240", "cost": "$18.50", "brand": 2 },
          { "id": 14, "name": "Graph Paper Notebook", "type": "Grid", "size_leaves": "100", "cost": "$2.80", "brand": 1 },
          { "id": 15, "name": "Black Paper Sketchbook", "type": "Blank", "size_leaves": "80", "cost": "$10.50", "brand": 4 },
          { "id": 16, "name": "Softcover Traveler Journal", "type": "Dotted", "size_leaves": "64", "cost": "$6.00", "brand": 2 },
          { "id": 17, "name": "Thick Academic Planner", "type": "Lined", "size_leaves": "300", "cost": "$14.00", "brand": 5 },
          { "id": 18, "name": "Lab Research Logbook", "type": "Grid", "size_leaves": "200", "cost": "$11.00", "brand": 1 },
          { "id": 19, "name": "Drafting Pad", "type": "Grid", "size_leaves": "50", "cost": "$3.50", "brand": 4 },
          { "id": 20, "name": "Miniature Pocket Journal", "type": "Blank", "size_leaves": "32", "cost": "$1.50", "brand": 3 }
        ];

        await Notebook.insertMany(initialNotebooks);
        console.log("Database seeded successfully with 20 notebooks.");

        // Verification log for virtual calculated field
        const sample = await Notebook.findOne({ id: 1 });
        if (sample) {
            console.log(`Verification: Notebook ID 1 cost_per_leaf is ${sample.cost_per_leaf}`);
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    }
}

app.use(express.json());
app.use(express.static('public'));

// Endpoint de diagnóstico para validar la conexión a la base de datos en Vercel
app.get("/debug-db", (req, res) => {
    const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
    };
    const readyState = mongoose.connection.readyState;
    const maskedURI = mongoURI.replace(/:([^@]+)@/, ":******@");

    res.json({
        status: states[readyState] || "unknown",
        readyState,
        maskedURI,
        env: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL,
            PORT: process.env.PORT
        }
    });
});


const dbMiddleware = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Error de conexión a la base de datos:", err.message);
        res.status(500).json({
            message: "Error de conexión a la base de datos (MongoDB Atlas)",
            error: err.message,
            tip: "Asegúrate de haber añadido la IP 0.0.0.0/0 (permitir acceso desde cualquier lugar) en el panel Network Access de MongoDB Atlas."
        });
    }
};

const notebookRouter = require("./routes/insectRoutes");

app.use("/notebookStore", dbMiddleware, notebookRouter);

// Solo escuchar si no estamos en entorno de Vercel
if (!process.env.VERCEL) {
    app.listen(port, () => console.log("Notebook Store Server is running on port --> ", port));
}

module.exports = app;
