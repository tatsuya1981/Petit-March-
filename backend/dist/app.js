"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./api/index"));
const app = (0, express_1.default)();
const port = 4000;
app.get("/", (req, res) => {
    res.json({ message: "ok" });
});
app.use(express_1.default.json());
app.use("/api", index_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
