/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('LEFT_FIELD', 'RIGHT_FIELD', 'LEFT_CENTER_FIELD', 'RIGHT_CENTER_FIELD', 'FIRST_BASE', 'SECOND_BASE', 'SHORT_STOP', 'THIRD_BASE', 'PITCHER', 'CATCHER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "preferences" "Position"[],
    "eligible" BOOLEAN NOT NULL DEFAULT true,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
