
import { Response } from "express";

export function randomHash(minLength = 10, acc = ''): string {
    if (acc.length <= minLength) {
        const str = Math.random().toString(36).slice(2);
        return randomHash(minLength, acc.concat(str))
    }

    return acc.slice(0, minLength);
}

/**
 * This function handles exceptions by adding a random hash for easy logging!
 * @param res - The response object to control what is sent back via API
 * @param e - The exception that was thrown.
 */
export function generateException(res: Response, e: any): void {
    const hash = randomHash();
    console.log(hash, e);
    res.status(500).send(`An error has occurred. Contact the Kickball team: ${hash}`);
}