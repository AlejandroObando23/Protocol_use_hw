const express = require("express");
const router = express.Router();
const notebookController = require("../controllers/insectController");

// Endpoint para obtener todos los cuadernos
router.get("/notebook", (req, res) => notebookController.getAll(req, res));

// Endpoint para obtener todos los cuadernos agrupados por tamaño
router.get("/notebook/size", (req, res) => notebookController.getBySize(req, res));

// Endpoint para eliminar cuadernos por categoría de tamaño (small, medium, large)
router.delete("/notebook/size/:sizeType", (req, res) => notebookController.deleteByCategory(req, res));

// Endpoint para eliminar un cuaderno por su id numérico
router.delete("/notebook/:id", (req, res) => notebookController.deleteById(req, res));

module.exports = router;

