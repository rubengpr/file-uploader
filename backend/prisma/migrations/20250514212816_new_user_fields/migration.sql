-- AlterTable
ALTER TABLE "User" ADD COLUMN     "country" TEXT,
ADD COLUMN     "fullname" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Admin',
ADD COLUMN     "timezone" TEXT;
