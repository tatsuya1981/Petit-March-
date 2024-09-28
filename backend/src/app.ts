import express from "express";
import apiRouters from "./api/index";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use(express.json());
app.use("/api", apiRouters);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
