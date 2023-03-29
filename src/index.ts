import express, { raw } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser'; // json parsing
import { is } from "typia";
import fs from 'fs';

const VERSION = require('../package.json').version; // app version

dotenv.config();
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
  const filePath = "forecast.json"
  // check body input
  if (!is<Predictions>(predictions)) {
    return res.status(400).send("Invalid predictions format");
  }
  let forecast = {};
  console.log(predictions);
  if(fs.existsSync(filePath)){
    const rawdata = fs.readFileSync(filePath,{encoding: "utf8"});
    forecast = JSON.parse(rawdata);
  }

  forecast = {...forecast,...predictions};
  const rawdata = JSON.stringify(forecast);
  fs.writeFileSync(filePath,rawdata);

  res.send(200);
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});