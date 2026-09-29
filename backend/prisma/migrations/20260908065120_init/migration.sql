-- CreateTable
CREATE TABLE "User_Favourite" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieToUser_Favourite" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MovieToUser_Favourite_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MovieToUser_Favourite_B_index" ON "_MovieToUser_Favourite"("B");

-- AddForeignKey
ALTER TABLE "_MovieToUser_Favourite" ADD CONSTRAINT "_MovieToUser_Favourite_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieToUser_Favourite" ADD CONSTRAINT "_MovieToUser_Favourite_B_fkey" FOREIGN KEY ("B") REFERENCES "User_Favourite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
