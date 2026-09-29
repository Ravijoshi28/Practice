import "dotenv/config";
import app from "./src/app.js";
import { prisma } from "./src/lib/neon.js";

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log("API listening on http://localhost:" + port);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}
