const express = require("express");
const Customer = require("../models/customer");
const router = express.Router();

router.get("/customer", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
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