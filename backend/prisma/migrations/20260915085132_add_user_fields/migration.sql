/*
  Warnings:

  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Favourite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieToUser_Favourite` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isVerified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MovieToUser_Favourite" DROP CONSTRAINT "_MovieToUser_Favourite_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieToUser_Favourite" DROP CONSTRAINT "_MovieToUser_Favourite_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "User_Favourite";

-- DropTable
DROP TABLE "_MovieToUser_Favourite";
