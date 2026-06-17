const mongoose = require("mongoose");

const notebook = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        size_leaves: { type: String, required: true },
        cost: { type: String, required: true },
        brand: { type: Number, required: true }
    },
    {
        collection: "notebook",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for cost per leaf ratio: cost / size_leaves
notebook.virtual("cost_per_leaf").get(function() {
    const numericCost = parseFloat(this.cost.replace(/[^0-9.]/g, ''));
    const numericLeaves = parseInt(this.size_leaves, 10);
    if (!numericLeaves || isNaN(numericCost)) return 0;
    return Number((numericCost / numericLeaves).toFixed(4));
});

module.exports = mongoose.model("notebook", notebook);

