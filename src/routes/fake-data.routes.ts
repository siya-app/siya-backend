import express from "express";
import { generateFakeUser, generateFakeTerrace } from "../db/seed.js";

const fakeDataRouter = express.Router();

fakeDataRouter.get("/fake-users", (req, res) => {
  const fakeUsers = Array.from({ length: 5 }, generateFakeUser);
  res.json(fakeUsers);
});

fakeDataRouter.get("/fake-terraces", (req, res) => {
  const fakeTerraces = Array.from({ length: 5 }, generateFakeTerrace);
  res.json(fakeTerraces);
});

export default fakeDataRouter;
