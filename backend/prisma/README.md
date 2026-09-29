# Database

The existing PostgreSQL schema and migrations are preserved. User maps to
User_Favourite, and Movie.title maps to name. Existing database records
have not been changed by the template reset.

From backend, run `npm run prisma:generate` after changing the schema.
Use `npm run prisma:validate` to validate it and `npm run prisma:studio` to
inspect the database. `npm run prisma:migrate -- --name your_change` creates
and applies a development migration; review schema changes before running it.
