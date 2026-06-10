const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Insect = require("./models/insect");

const mongoURI = process.env.MONGODB_URI || "mongodb+srv://root123:root123@cluster0.0s6q0vr.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", (error) => console.error("Error de conexión a la base de datos:", error));
db.once("open", async () => {
    console.log("System connected to MongoDB.");
    await seedInsects();
});

// Seed data function
async function seedInsects() {
    try {
        // Clear collection to ensure we have exactly 20 clean records with the new fields
        await Insect.deleteMany({});
        console.log("Cleared existing insect collection.");

        const initialInsects = [
          {
            "id": 1,
            "common_name": "Honey Bee",
            "scientific_name": "Apis mellifera",
            "order": "Hymenoptera",
            "family": "Apidae",
            "wingspan_mm": 20,
            "body_length_mm": 15,
            "characteristics": {
              "habitat": "Meadows, forests, and gardens worldwide.",
              "diet": "Nectar and pollen.",
              "fun_fact": "They communicate by performing a complex waggle dance to indicate the location of food sources."
            }
          },
          {
            "id": 2,
            "common_name": "Monarch Butterfly",
            "scientific_name": "Danaus plexippus",
            "order": "Lepidoptera",
            "family": "Nymphalidae",
            "wingspan_mm": 100,
            "body_length_mm": 50,
            "characteristics": {
              "habitat": "Open areas, meadows, and forests in North America.",
              "diet": "Flower nectar, especially from milkweed (when they are caterpillars).",
              "fun_fact": "They undertake one of the longest and most complex migrations in the animal kingdom, traveling thousands of miles."
            }
          },
          {
            "id": 3,
            "common_name": "Rhinoceros Beetle",
            "scientific_name": "Oryctes nasicornis",
            "order": "Coleoptera",
            "family": "Scarabaeidae",
            "wingspan_mm": 80,
            "body_length_mm": 40,
            "characteristics": {
              "habitat": "Forests and areas with decaying wood in Europe and Asia.",
              "diet": "Tree sap and rotting fruits.",
              "fun_fact": "Despite their robust and intimidating appearance, they are completely harmless to humans and do not bite."
            }
          },
          {
            "id": 4,
            "common_name": "Praying Mantis",
            "scientific_name": "Mantis religiosa",
            "order": "Mantodea",
            "family": "Mantidae",
            "wingspan_mm": 70,
            "body_length_mm": 75,
            "characteristics": {
              "habitat": "Scrublands, meadows, and gardens.",
              "diet": "Carnivorous (insects, spiders, and occasionally small vertebrates).",
              "fun_fact": "They have the unique ability to turn their heads 180 degrees to scan their surroundings for prey."
            }
          },
          {
            "id": 5,
            "common_name": "Leafcutter Ant",
            "scientific_name": "Atta cephalotes",
            "order": "Hymenoptera",
            "family": "Formicidae",
            "wingspan_mm": 1,
            "body_length_mm": 12,
            "characteristics": {
              "habitat": "Tropical rainforests and forests of Central and South America.",
              "diet": "A specific fungus that they cultivate in their nests using the leaves they cut.",
              "fun_fact": "They are considered the world's first farmers, having cultivated fungus millions of years before humans invented agriculture."
            }
          },
          {
            "id": 6,
            "common_name": "Emperor Dragonfly",
            "scientific_name": "Anax imperator",
            "order": "Odonata",
            "family": "Aeshnidae",
            "wingspan_mm": 100,
            "body_length_mm": 80,
            "characteristics": {
              "habitat": "Near ponds, lakes, and slow-moving rivers in Europe and Africa.",
              "diet": "Carnivorous (mosquitoes, flies, and other smaller dragonflies).",
              "fun_fact": "They are exceptional aerial hunters and are among the few insects capable of flying backward."
            }
          },
          {
            "id": 7,
            "common_name": "Seven-spotted Ladybug",
            "scientific_name": "Coccinella septempunctata",
            "order": "Coleoptera",
            "family": "Coccinellidae",
            "wingspan_mm": 10,
            "body_length_mm": 8,
            "characteristics": {
              "habitat": "Gardens, crops, and fields across much of the Northern Hemisphere.",
              "diet": "Aphids, mites, and scale insects.",
              "fun_fact": "They are highly valued as natural allies in agriculture because they voraciously consume plant pests."
            }
          },
          {
            "id": 8,
            "common_name": "Yellow Fever Mosquito",
            "scientific_name": "Aedes aegypti",
            "order": "Diptera",
            "family": "Culicidae",
            "wingspan_mm": 6,
            "body_length_mm": 5,
            "characteristics": {
              "habitat": "Urban and peri-urban areas in tropical and subtropical climates.",
              "diet": "Human blood (females) and nectar (males).",
              "fun_fact": "Only female mosquitoes bite, as they require the proteins found in blood to develop their eggs."
            }
          },
          {
            "id": 9,
            "common_name": "Great Green Bush-cricket",
            "scientific_name": "Tettigonia viridissima",
            "order": "Orthoptera",
            "family": "Tettigoniidae",
            "wingspan_mm": 90,
            "body_length_mm": 50,
            "characteristics": {
              "habitat": "Humid meadows, grasslands, and scrublands in Eurasia.",
              "diet": "Omnivorous (plants, caterpillars, and other small insects).",
              "fun_fact": "Males produce their characteristic singing sound by rubbing their wings together to attract mates."
            }
          },
          {
            "id": 10,
            "common_name": "Firefly",
            "scientific_name": "Lampyris noctiluca",
            "order": "Coleoptera",
            "family": "Lampyridae",
            "wingspan_mm": 22,
            "body_length_mm": 15,
            "characteristics": {
              "habitat": "Humid areas, forests, and meadows with dense vegetation.",
              "diet": "Snails and slugs (during their larval stage).",
              "fun_fact": "They generate light through a chemical reaction in their abdomen known as bioluminescence."
            }
          },
          {
            "id": 11,
            "common_name": "Atlas Moth",
            "scientific_name": "Attacus atlas",
            "order": "Lepidoptera",
            "family": "Saturniidae",
            "wingspan_mm": 240,
            "body_length_mm": 80,
            "characteristics": {
              "habitat": "Tropical and subtropical forests of Southeast Asia.",
              "diet": "Larvae eat leaves; adults have no mouthparts and do not feed.",
              "fun_fact": "They have one of the largest wingspans of any lepidopteran in the world."
            }
          },
          {
            "id": 12,
            "common_name": "Bullet Ant",
            "scientific_name": "Paraponera clavata",
            "order": "Hymenoptera",
            "family": "Formicidae",
            "wingspan_mm": 2,
            "body_length_mm": 30,
            "characteristics": {
              "habitat": "Wet lowland rainforests in Central and South America.",
              "diet": "Nectar and small arthropods.",
              "fun_fact": "It is named for its powerful and extremely painful sting, compared to being shot with a bullet."
            }
          },
          {
            "id": 13,
            "common_name": "German Wasp",
            "scientific_name": "Vespula germanica",
            "order": "Hymenoptera",
            "family": "Vespidae",
            "wingspan_mm": 25,
            "body_length_mm": 13,
            "characteristics": {
              "habitat": "Meadows, forests, and urban areas worldwide.",
              "diet": "Insects, fruit, and human food scraps.",
              "fun_fact": "They construct nests from paper pulp made by chewing wood mixed with their saliva."
            }
          },
          {
            "id": 14,
            "common_name": "Stag Beetle",
            "scientific_name": "Lucanus cervus",
            "order": "Coleoptera",
            "family": "Lucanidae",
            "wingspan_mm": 70,
            "body_length_mm": 60,
            "characteristics": {
              "habitat": "Oak forests and woodlands in Europe.",
              "diet": "Sap runs and rotting wood.",
              "fun_fact": "Males have large mandibles resembling stag antlers, which they use to wrestle rivals."
            }
          },
          {
            "id": 15,
            "common_name": "House Fly",
            "scientific_name": "Musca domestica",
            "order": "Diptera",
            "family": "Muscidae",
            "wingspan_mm": 13,
            "body_length_mm": 7,
            "characteristics": {
              "habitat": "Human habitations worldwide.",
              "diet": "Decaying organic matter and sweet liquids.",
              "fun_fact": "They taste with their feet, which are 10 million times more sensitive to sugar than human tongues."
            }
          },
          {
            "id": 16,
            "common_name": "Periodical Cicada",
            "scientific_name": "Magicicada septendecim",
            "order": "Hemiptera",
            "family": "Cicadidae",
            "wingspan_mm": 60,
            "body_length_mm": 40,
            "characteristics": {
              "habitat": "Deciduous forests in eastern North America.",
              "diet": "Plant xylem sap.",
              "fun_fact": "They spend 17 years underground as nymphs before emerging in massive synchronized numbers."
            }
          },
          {
            "id": 17,
            "common_name": "American Cockroach",
            "scientific_name": "Periplaneta americana",
            "order": "Blattodea",
            "family": "Blattidae",
            "wingspan_mm": 40,
            "body_length_mm": 40,
            "characteristics": {
              "habitat": "Warm, damp areas worldwide, particularly sewers and basements.",
              "diet": "Omnivorous (almost any organic material).",
              "fun_fact": "They can survive for up to a week without their head because they breathe through spiracles on their body."
            }
          },
          {
            "id": 18,
            "common_name": "Field Cricket",
            "scientific_name": "Gryllus campestris",
            "order": "Orthoptera",
            "family": "Gryllidae",
            "wingspan_mm": 35,
            "body_length_mm": 25,
            "characteristics": {
              "habitat": "Grasslands and fields in Europe.",
              "diet": "Grass, roots, and small invertebrates.",
              "fun_fact": "They dig tunnels in the ground and sit at the entrance singing to attract females."
            }
          },
          {
            "id": 19,
            "common_name": "Desert Locust",
            "scientific_name": "Schistocerca gregaria",
            "order": "Orthoptera",
            "family": "Acrididae",
            "wingspan_mm": 120,
            "body_length_mm": 60,
            "characteristics": {
              "habitat": "Deserts and semi-arid regions of Africa and Asia.",
              "diet": "Green vegetation and leaves.",
              "fun_fact": "They can change their behavior and body form, swarming in billions to destroy entire agricultural crops."
            }
          },
          {
            "id": 20,
            "common_name": "Hercules Beetle",
            "scientific_name": "Dynastes hercules",
            "order": "Coleoptera",
            "family": "Scarabaeidae",
            "wingspan_mm": 220,
            "body_length_mm": 170,
            "characteristics": {
              "habitat": "Rainforests of Central and South America.",
              "diet": "Decaying wood and rotting fruit.",
              "fun_fact": "They are capable of carrying objects up to 850 times their own body weight."
            }
          }
        ];

        await Insect.insertMany(initialInsects);
        console.log("Database seeded successfully with 20 insects.");

        // Verification log for virtual calculated field
        const sample = await Insect.findOne({ id: 1 });
        if (sample) {
            console.log(`Verification: Insect ID 1 wingspan_to_body_ratio is ${sample.wingspan_to_body_ratio}`);
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    }
}

app.use(express.json());
app.use(express.static('public'));

const insectRouter = require("./routes/insectRoutes");

app.use("/insectStore", insectRouter);

// Solo escuchar si no estamos en entorno de Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => console.log("Insect Store Server is running on port --> ", port));
}

module.exports = app;
