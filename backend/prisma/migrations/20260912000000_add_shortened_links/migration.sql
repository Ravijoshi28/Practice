-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortedLink" (
    "id" SERIAL NOT NULL,
    "originalLink" TEXT NOT NULL,
    "shortLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "click" INTEGER NOT NULL DEFAULT 0,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "ShortedLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShortedLink_shortLink_key" ON "ShortedLink"("shortLink");

-- CreateIndex
CREATE INDEX "ShortedLink_createdById_idx" ON "ShortedLink"("createdById");

-- AddForeignKey
ALTER TABLE "ShortedLink" ADD CONSTRAINT "ShortedLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
