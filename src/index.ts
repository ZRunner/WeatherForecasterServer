import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from 'body-parser'; // json parsing
import { is } from "typia";
import { createConnection, saveForecast } from "./database";

const VERSION = require('../package.json').version; // app version

const app = express();
const port = process.env.PORT ?? 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    "version": VERSION,
  });
});

app.post('/data', (req, res) => {
  const predictions = req.body;
  // check body input
  if (!is<Predictions>(predictions)) {
    return res.status(400).send("Invalid predictions format");
  }
  const db = createConnection();

  saveForecast(db,predictions);
  console.log(new Date().toISOString(), JSON.stringify(predictions));
  res.sendStatus(202);
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});