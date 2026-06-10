const express = require("express");
const router = express.Router();
const insectController = require("../controllers/insectController");

// Endpoint para obtener todos los insectos
router.get("/insect", (req, res) => insectController.getAll(req, res));

// Endpoint para obtener todos los insectos agrupados por tamaño
router.get("/insect/size", (req, res) => insectController.getBySize(req, res));

// Endpoint para eliminar insectos por categoría de tamaño (small, medium, large)
router.delete("/insect/size/:sizeType", (req, res) => insectController.deleteByCategory(req, res));

// Endpoint para eliminar un insecto por su id numérico
router.delete("/insect/:id", (req, res) => insectController.deleteById(req, res));

module.exports = router;
