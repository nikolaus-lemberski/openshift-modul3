const express = require("express");
const app = express();
const port = 8080;

app.get("/", (req, res) => res.send("Hello, World!"));

app.get("/health/readiness", (req, res) => res.json({ status: "ready" }));
app.get("/health/liveness", (req, res) => res.json({ status: "live" }));

app.listen(port, () => {
  console.log(`Hello world app, listening on port ${port}`);
});
