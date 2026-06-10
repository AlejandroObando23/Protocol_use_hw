const express = require("express");
const Customer = require("../models/customer");
const router = express.Router();
//Not Atributes
router.get("/customer", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/customer/name", async (req, res) => {
    try {
        const customers = await Customer.find().select("name");
        res.json(customers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get("/customer/money-spent", async (req, res) => {
    try {
        const customers = await Customer.find().select("moneySpent");
        res.json(customers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get("/customer/money-spent/total", async (req, res) => {
    try {
        const result = await Customer.aggregate([
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: "$moneySpent" }
                }
            }
        ]);
        const total = result.length > 0 ? result[0].totalSpent : 0;
        res.json({ totalSpent: total });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get("/customer/count", async (req, res) => {
    try {
        const customers = await Customer.countDocuments();
        res.json(customers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.get("/customer/summary", async (req, res) => {
    try {
        const customers = await Customer.aggregate([
            {
                $group: {
                    _id: "$name",
                    count: { $sum: 1 },
                    totalSpent: { $sum: "$moneySpent" }
                }
            }
        ]);
        res.json(customers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})



//Atrubutes
router.get("/customer/:id", async (req, res) => {
    try {
        const customerObject = await Customer.findOne({ id: req.params.id });
        if (customerObject == null) {
            return res.status(404).json({ status: 404 });
        }
        else {
            res.json(customerObject);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/customer/name/:name", async (req, res) => {
    try {
        const customerObject = await Customer.findOne({ name: req.params.name });
        if (customerObject == null) {
            return res.status(404).json({ status: 404 });
        }
        else {
            res.json(customerObject);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.get("/customer/age/:age", async (req, res) => {
    try {
        const customerObject = await Customer.findOne({ age: req.params.age });
        if (customerObject == null) {
            return res.status(404).json({ status: 404 });
        }
        else {
            res.json(customerObject);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Crear un nuevo cliente (POST)
router.post("/customer", async (req, res) => {
    const customer = new Customer({
        id: req.body.id,
        name: req.body.name,
        age: req.body.age,
        moneySpent: req.body.moneySpent
    });
    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar un cliente existente (PUT)
router.put("/customer/:id", async (req, res) => {
    try {
        // Se busca por el campo 'id' de tu esquema, no por el '_id' de Mongo
        const updatedCustomer = await Customer.findOneAndUpdate(
            { id: req.params.id }, 
            req.body, 
            { new: true } // Esto asegura que la respuesta devuelva el objeto ya actualizado
        );
        if (updatedCustomer == null) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un cliente (DELETE)
router.delete("/customer/:id", async (req, res) => {
    try {
        const deletedCustomer = await Customer.findOneAndDelete({ id: req.params.id });
        if (deletedCustomer == null) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;