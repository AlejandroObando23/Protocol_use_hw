const port = 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", (error) => console.error("Error de conexión a la base de datos:", error));
db.once("open", () => console.log("System connected to MongoDB."));

app.use(express.json());
app.use(express.static('public'));

const customerRouter = require("./routes/customerRoutes");

app.use("/customerStore", customerRouter);

app.listen(port, () => console.log("Edison's Computer Store Server is running on port --> ", port));
