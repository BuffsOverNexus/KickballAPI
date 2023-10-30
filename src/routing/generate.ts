import { PrismaClient, Gender, Position, Player } from "@prisma/client";
import express, { Request, Response, Router } from "express";
import { generateException } from "../util/exception_handling";
import getRandomNumber from "../util/random_util";
import isEmpty from "../util/array_util";

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post("/generate/batting", async (req: Request, res: Response) => {
  try {
    if (!req.body.teamId) {
      res.status(400).send("This API requires: teamId; Optionally: ineligible");
      return;
    }

    // Check if there are ineligible players
    const ineligible = (req.body.ineligible as Number[]) ?? [];
    const id = Number(req.body.teamId);

    const team = await prisma.team.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
      },
    });

    if (!team) {
      res.status(400).send(`The team with id, ${id}, was not found.`);
      return;
    }

    // Generate batting order
    const roster = team.players.filter(
      (player) => !ineligible.includes(player.id)
    );

    let battingOrder: Player[] = [];
    // Keep track of males so more than 2 cannot kick in a row.
    let numMales = 0;
    const MAXIMUM_NUM_MALES_KICKING = 2;

    // Increment for number of players.
    while (battingOrder.length != roster.length) {
      // Generate random player id
      let randomId = getRandomNumber(0, roster.length);
      const leftOver = roster.filter((pl) => !battingOrder.includes(pl));
      const hasUnassignedMales = !isEmpty(
        leftOver.filter((pl) => pl.gender == Gender.MALE)
      );

      // Ensure we haven't used that player id
      const player = roster.at(randomId);

      if (!player) continue;

      // Ensure we don't already have this player
      if (!isEmpty(battingOrder.filter((batter) => batter.id == player.id)))
        continue;

      // We need a female... Try again.
      if (numMales >= MAXIMUM_NUM_MALES_KICKING && player.gender == Gender.MALE)
        continue;

      // We have males left. Find another male.
      if (numMales < MAXIMUM_NUM_MALES_KICKING &&
            player.gender == Gender.FEMALE &&
            hasUnassignedMales)
        continue;

      // We are okay to add
      battingOrder.push(player);

      // Increment males kicking or reset if female
      if (player.gender == Gender.FEMALE) 
        numMales = 0;
      else 
        numMales++;
    }

    res.json(battingOrder);
  } catch (e: any) {
    generateException(res, e);
  }
});

export default router;
