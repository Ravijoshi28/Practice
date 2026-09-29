-- Preserve existing users, movies, and the favorites join table.
ALTER TABLE "User_Favourite" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "Movie"
    ALTER COLUMN "genre" DROP NOT NULL,
    ADD COLUMN "poster_path" TEXT,
    ADD COLUMN "release_date" TEXT NOT NULL DEFAULT '',
    ADD COLUMN "overview" TEXT NOT NULL DEFAULT '',
    ADD COLUMN "vote_average" DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN "adult" BOOLEAN NOT NULL DEFAULT false;
