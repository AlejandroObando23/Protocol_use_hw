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
        const customers = await Customer.find().select("moneySpent").sum();
        res.json(customers);
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

module.exports = router;