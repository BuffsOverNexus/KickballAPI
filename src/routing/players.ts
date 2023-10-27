import { PrismaClient, Gender, Position } from "@prisma/client";
import express, { Request, Response, Router } from "express";
import { generateException } from "../util/exception_handling";
import isEmpty from "../util/array_util";

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post("/player", async (req: Request, res: Response) => {
    try {
        if (req.body.firstName && req.body.lastName && req.body.teamId && 
            req.body.gender) {
            const firstName = String(req.body.firstName);
            const lastName = String(req.body.lastName);
            const teamId = Number(req.body.teamId);
            const preferences = req.body.preferences as Position[] ?? [];
            const gender = req.body.gender as Gender ?? Gender.MALE;
            
            const player = await prisma.player.create({
                data: {
                    firstName,
                    lastName, 
                    teamId,
                    preferences,
                    gender,
                }
            });

            if (player) {
                console.log(`POST /player ${player}`);
                res.json(player);
            } else {
                console.log(`The data was not created for: ${firstName}, ${lastName}, ${teamId}, ${preferences}, ${gender}`);
                res.status(400).send(`The data was not created for: ${firstName}, ${lastName}`);
            }
        } else {
            res.send("This API requires: firstName, lastName, teamId. Optionally: preferences (Positions), gender (default as MALE)");
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.get("/player", async (req: Request, res: Response) => {
    try {
        if (!req.query.id) {
            res.status(400).send("This API requires: id");
            return;
        }

        const id = Number(req.query.id);
        const player = await prisma.player.findUnique({
            where: {
                id
            }
        });

        if (player) {
            console.log(`GET /player ${player}`);
            res.json(player);
        } else {
            res.status(400).send(`The player with identifier, ${id}, was not found.`);
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.put("/player", async (req: Request, res: Response) => {
    try {
        if (!req.query.id) {
            res.status(400).send("This API requires params: id");
            return;
        }

        if (req.body.firstName && req.body.lastName && req.body.teamId) {
            const id = Number(req.query.id);
            const firstName = String(req.body.firstName);
            const lastName = String(req.body.lastName);
            const teamId = Number(req.body.teamId);
            const preferences = req.body.preferences as Position[] ?? [];
            const gender = req.body.gender as Gender ?? Gender.MALE;
            
            // Attempt to update the player.
            const player = await prisma.player.upsert({
                update: {
                    firstName,
                    lastName,
                    teamId,
                    preferences,
                    gender
                },
                create: {
                    firstName,
                    lastName,
                    teamId,
                    preferences,
                    gender
                },
                where: {
                    id
                }
            });

            if (player) {
                res.json(player);
            } else {
                res.status(400).send(`The player ${id} was not found.`);
            }
        } else {
            res.status(400).send("This API needs at least one of the following: firstName, lastName, teamId, gender, preferences");
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.delete("/player", async (req: Request, res: Response) => {
    try {
        if (!req.query.id) {
            res.status(400).send("This API requires: id");
            return;
        }
        
        const id = Number(req.query.id);
        const player = await prisma.player.findUnique({
            where: {
                id
            }
        });
        
        if (!player) {
            res.status(400).send(`The player ${id} was not found.`);
            return;
        }

        await prisma.player.delete({
            where: {
                id
            }
        });

        res.json(player);

    } catch (e: any) {
        generateException(res, e);
    }
});

export default router;