const mongoose = require("mongoose");

const insectSchema = new mongoose.Schema(
{
    id: { type: Number, required: true, unique: true },
    common_name: { type: String, required: true },
    scientific_name: { type: String, required: true },
    order: { type: String, required: true },
    family: { type: String, required: true },
    wingspan_mm: { type: Number, required: true },
    body_length_mm: { type: Number, required: true },
    characteristics: {
        habitat: { type: String, required: true },
        diet: { type: String, required: true },
        fun_fact: { type: String, required: true }
    }
},
{ 
    collection: "Insects",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

// Virtual for ratio: wingspan_mm / body_length_mm
insectSchema.virtual("wingspan_to_body_ratio").get(function() {
    if (!this.body_length_mm) return 0;
    return Number((this.wingspan_mm / this.body_length_mm).toFixed(2));
});

module.exports = mongoose.model("Insect", insectSchema);
