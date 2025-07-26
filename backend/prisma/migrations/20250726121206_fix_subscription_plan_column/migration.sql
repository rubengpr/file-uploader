/*
  Warnings:

  - Changed the type of `plan` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
-- Fix the plan column type to use the Plan enum instead of TEXT
ALTER TABLE "Subscription" ALTER COLUMN "plan" TYPE "Plan" USING "plan"::"Plan";
