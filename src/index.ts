import { PrismaClient } from "@prisma/client";
import express from "express";
import cors  from "cors";

import accounts from './routing/accounts';


const prisma = new PrismaClient();

const app = express().disable("x-powered-by");
const port = process.env.PORT || 3000;
const environment = process.env.RAILWAY_ENVIRONMENT || "local";

if (environment == "local")
  require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.use('/', accounts);


app.listen(Number(port), () => {
    console.log(`Kickball API active at http://localhost:${port}`);
});

