const express = require("express");
const app = express();
const port = 8080;

const appName = process.env.APP_NAME;

app.get("/", (req, res) => res.send(`Hello from ${appName}!`));

app.get("/health/readiness", (req, res) => res.json({ status: "UP" }));
app.get("/health/liveness", (req, res) => res.json({ status: "UP" }));

app.listen(port, () => {
  if (!appName) {
    throw new Error("APP_NAME not set");
  }
  console.log(`${appName} is now accepting traffic on port ${port}`);
});
