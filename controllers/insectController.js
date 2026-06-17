const Notebook = require("../models/insect");

class NotebookController {

    classifyBySize(notebooks) {
        const classified = {
            small: [],
            medium: [],
            large: []
        };

        notebooks.forEach(notebook => {
            const leaves = parseInt(notebook.size_leaves, 10) || 0;
            if (leaves < 80) {
                classified.small.push(notebook);
            } else if (leaves <= 150) {
                classified.medium.push(notebook);
            } else {
                classified.large.push(notebook);
            }
        });

        return classified;
    }

    // Obtiene todos los cuadernos
    async getAll(req, res) {
        try {
            const notebooks = await Notebook.find();
            res.json(notebooks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Obtiene todos los cuadernos agrupados por categoría de tamaño
    async getBySize(req, res) {
        try {
            const allNotebooks = await Notebook.find();
            const classified = this.classifyBySize(allNotebooks);
            res.json(classified);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Elimina un cuaderno por su ID numérico
    async deleteById(req, res) {
        try {
            const notebookId = Number(req.params.id);
            if (isNaN(notebookId)) {
                return res.status(400).json({ message: "Invalid notebook ID format" });
            }

            const deletedNotebook = await Notebook.findOneAndDelete({ id: notebookId });
            if (deletedNotebook == null) {
                return res.status(404).json({ message: "Notebook not found" });
            }
            res.json({ message: "Notebook deleted successfully", deletedNotebook });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Elimina todos los cuadernos de una categoría de tamaño determinada (small, medium o large)
    async deleteByCategory(req, res) {
        try {
            const sizeType = req.params.sizeType.toLowerCase();
            if (sizeType !== "small" && sizeType !== "medium" && sizeType !== "large") {
                return res.status(400).json({ message: "Invalid size category. Use small, medium, or large." });
            }

            // Obtener todos los cuadernos
            const allNotebooks = await Notebook.find();

            // Clasificar usando el método de instancia
            const classified = this.classifyBySize(allNotebooks);

            // Obtener cuadernos correspondientes a la categoría seleccionada
            const notebooksToDelete = classified[sizeType];

            if (notebooksToDelete.length === 0) {
                return res.status(404).json({ message: `No notebooks found in the '${sizeType}' category.` });
            }

            // Extraer IDs a eliminar
            const idsToDelete = notebooksToDelete.map(notebook => notebook.id);

            // Eliminar de la base de datos
            await Notebook.deleteMany({ id: { $in: idsToDelete } });

            res.json({
                message: `Notebooks in category '${sizeType}' deleted successfully`,
                count: notebooksToDelete.length,
                deletedNotebooks: notebooksToDelete
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

// Exportamos una instancia del controlador
module.exports = new NotebookController();

