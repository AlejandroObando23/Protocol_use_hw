const Insect = require("../models/insect");

class InsectController {

    classifyBySize(insects) {
        const classified = {
            small: [],
            medium: [],
            large: []
        };

        insects.forEach(insect => {
            const length = insect.body_length_mm;
            if (length < 15) {
                classified.small.push(insect);
            } else if (length <= 50) {
                classified.medium.push(insect);
            } else {
                classified.large.push(insect);
            }
        });

        return classified;
    }

    // Obtiene todos los insectos
    async getAll(req, res) {
        try {
            const insects = await Insect.find();
            res.json(insects);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Obtiene todos los insectos agrupados por categoría de tamaño
    async getBySize(req, res) {
        try {
            const allInsects = await Insect.find();
            const classified = this.classifyBySize(allInsects);
            res.json(classified);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Elimina un insecto por su ID numérico
    async deleteById(req, res) {
        try {
            const insectId = Number(req.params.id);
            if (isNaN(insectId)) {
                return res.status(400).json({ message: "Invalid insect ID format" });
            }

            const deletedInsect = await Insect.findOneAndDelete({ id: insectId });
            if (deletedInsect == null) {
                return res.status(404).json({ message: "Insect not found" });
            }
            res.json({ message: "Insect deleted successfully", deletedInsect });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Elimina todos los insectos de una categoría de tamaño determinada (small, medium o large)
    async deleteByCategory(req, res) {
        try {
            const sizeType = req.params.sizeType.toLowerCase();
            if (sizeType !== "small" && sizeType !== "medium" && sizeType !== "large") {
                return res.status(400).json({ message: "Invalid size category. Use small, medium, or large." });
            }

            // Obtener todos los insectos
            const allInsects = await Insect.find();

            // Clasificar usando el método de instancia
            const classified = this.classifyBySize(allInsects);

            // Obtener insectos correspondientes a la categoría seleccionada
            const insectsToDelete = classified[sizeType];

            if (insectsToDelete.length === 0) {
                return res.status(404).json({ message: `No insects found in the '${sizeType}' category.` });
            }

            // Extraer IDs a eliminar
            const idsToDelete = insectsToDelete.map(insect => insect.id);

            // Eliminar de la base de datos
            await Insect.deleteMany({ id: { $in: idsToDelete } });

            res.json({
                message: `Insects in category '${sizeType}' deleted successfully`,
                count: insectsToDelete.length,
                deletedInsects: insectsToDelete
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

// Exportamos una instancia del controlador
module.exports = new InsectController();
