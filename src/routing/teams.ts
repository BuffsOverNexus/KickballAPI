import { PrismaClient } from "@prisma/client";
import express, { Request, Response, Router } from "express";
import { generateException } from "../util/exception_handling";

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post("/team", async (req: Request, res: Response) => {
    try {
        if (req.body.name && req.body.accountId) {
            const name = String(req.body.name)
            const accountId = Number(req.body.accountId)

            const account = await prisma.account.findUnique({
                where: {
                    id: accountId
                }
            });

            if (!account) {
                res.status(400).send(`The accountId, ${accountId}, was not a valid identifier.`);
            }

            const team = await prisma.team.create({
                data: {
                    name,
                    accountId
                }
            });

            if (team) {
                res.json(team);
            } else {
                res.status(400).send(`The team, ${name}, is already in use.`);
            }
            
        } else {
            res.status(400).send(`This API requires: name, accountId`);
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.get("/team", async (req: Request, res: Response) => {
    try {
        if (req.query.id) {
            const id = Number(req.query.id);
            const team = await prisma.team.findUnique({
                where: {
                    id
                }
            });

            if (team) {
                res.json(team);
            } else {
                res.status(400).send(`The teamId, ${id}, was not found.`);
            }
        } else {
            res.status(400).send(`This API requires: id`);
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.get("/teams", async (req: Request, res: Response) => {
    try {
        if (req.query.accountId) {
            const accountId = Number(req.query.accountId);
            const teams = await prisma.team.findMany({
                where: {
                    accountId
                }
            });

            res.json(teams);
        } else {
            res.status(400).send("This APi requires: accountId");
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.get("/roster", async (req: Request, res: Response) => {
    try {
        if (req.query.teamId) {
            const teamId = Number(req.query.teamId);
            const roster = await prisma.team.findUnique({
                where: {
                    id: teamId
                }, 
                include: {
                    players: true
                }
            });

            if (roster) {
                res.json(roster);
            } else {
                res.status(400).send(`The teamId, ${teamId}, was not found.`);
            }
        } else {
            res.status(400).send("This API requires: teamId");
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

export default router;