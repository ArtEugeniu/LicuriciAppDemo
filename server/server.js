import express from "express";
import cors from "cors";
import { initDB } from "./db/index.js";
import { routerSpectacles } from "./routes/spectacles.js";
import { routerSchedule } from "./routes/schedule.js";
import { routerSales } from "./routes/sales.js";
import { routerPrint } from "./routes/print.js";
import { routerTicketsIn } from "./routes/tickets_in.js";
import { routerTicketSerial } from "./routes/ticket_serial.js";
import { routerTicketsReport } from "./routes/ticketsReport.js";

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  await initDB();

  app.use("/api/spectacles", routerSpectacles);
  app.use("/api/schedule", routerSchedule);
  app.use("/api/sales", routerSales);
  app.use("/api/print", routerPrint);
  app.use("/api/tickets_in", routerTicketsIn);
  app.use("/api/ticket_serial", routerTicketSerial);
  app.use("/api/ticketsReport", routerTicketsReport);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
