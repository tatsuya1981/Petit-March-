import express from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("");

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
