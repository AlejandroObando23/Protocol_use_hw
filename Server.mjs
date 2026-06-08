import express from "express";
const app = express();
const port = 4003;

app.get('/', (req, res) => {
    res.send("Welcome Alejandro Obando to my server");
});

app.listen(port, () => {
    console.log(`Server AlejandroObando is running on port ${port}`);
});
