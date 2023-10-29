import { PrismaClient } from "@prisma/client";
import express, { Request, Response, Router } from "express";
import { generateException } from "../util/exception_handling";

import * as crypto from 'crypto';

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post('/account', async (req: Request, res: Response) => {
    // Create account
    try {
        if (req.body.username && req.body.password) {
            const username = String(req.body.username);
            // This hashes on top of client's hashed password
            const password = crypto.createHash('sha256').update(String(req.body.password)).digest('hex');
            const account = await prisma.account.create({
                data: {
                    username,
                    password
                }
            });

            if (account) {
                res.json(account);
            } else {
                res.status(400).send(`The account username, ${username}, was already in use.`);
            }
        } else {
            res.status(400).send("This API requires: username, password (hashed)");
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.get('/account', async (req: Request, res: Response) => {
    try {
        if (req.query.id) {
            const id = Number(req.query.id);
            const account = await prisma.account.findUnique({
                where: {
                    id
                }
            });

            if (account) {
                res.json(account);
            } else {
                res.status(400).send(`The account id, ${id}, was not found in the system.`);
            }
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.get('/login', async (req: Request, res: Response) => {
    try {
        if (req.query.username && req.query.password) {
            const username = String(req.query.username);
            // This hashes on top of what is already hashed from the client.
            const password = crypto.createHash('sha256').update(String(req.query.password)).digest('hex');
            const account = await prisma.account.findUnique({
                where: {
                    username,
                    password
                }
            });

            if (account) {
                res.json(account);
            } else {
                res.status(400).send(`The account credentials provided was not valid.`);
            }
        } else {
            res.status(400).send("This API requires: username, password (hashed)");
        }
    } catch (e: any) {
        generateException(res, e);
    }
});

router.delete("/account", async (req: Request, res: Response) => {
    try {
        if (!req.query.id) {
            res.status(400).send("This API requires: id (account id)");
            return;
        }

        const id = Number(req.query.id);
        const account = await prisma.account.findUnique({
            where: {
                id
            }
        });

        if (!account) {
            res.status(400).send(`The account with id, ${id}, was not found.`);
            return;
        }

        await prisma.account.delete({
            where: {
                id
            }
        });

        res.json(account);
    } catch (e: any) {
        generateException(res, e);
    }
});

router.patch("/account/reset/password", async (req: Request, res: Response) => {
    try {
        if (!req.query.id || !req.query.password) {
            res.status(400).send("This API requires: id, password");
            return;
        }
        
        const id = Number(req.query.id);
        const password = crypto.createHash('sha256').update(String(req.query.password)).digest('hex');

        const account = await prisma.account.findUnique({
            where: {
                id
            }
        });

        if (!account) {
            res.status(400).send(`The account with id, ${id}, does not exist.`);
            return;
        }

        const updatedAccount = await prisma.account.update({
            data: {
                password
            },
            where: {
                id
            }
        });

        res.json(updatedAccount);
    } catch (e: any) {
        generateException(res, e);
    }
});

export default router;