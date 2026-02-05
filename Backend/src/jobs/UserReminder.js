import prisma from "../prisma.js";
import cron from "node-cron";
import dotenv from "dotenv";
import { sendEmailReminder, verifyEmailTransport, initializeEmailTransport } from "../services/email.service.js";
import { SCHEDULE_OFFSET_DAYS, WINDOW_MINUTES } from "../config/constants.js";

dotenv.config();

console.log("DEBUG: carregadas env vars:",
  "MAIL_USER?", !!process.env.MAIL_USER,
  "MAIL_PASS?", !!process.env.MAIL_PASS,
  "DATABASE_URL?", !!process.env.DATABASE_URL,
  "NODE_ENV:", process.env.NODE_ENV || "undefined"
);

function datePlusDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function minutesBefore(date, mins) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - mins);
  return d;
}

function minutesAfter(date, mins) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + mins);
  return d;
}

// Guardar IDs de eventos que já foram notificados nesta sessão
const notifiedEventIds = new Set();

async function fetchEventsToNotify() {
  const now = new Date();
  const target = datePlusDays(now, SCHEDULE_OFFSET_DAYS);
  const from = minutesBefore(target, WINDOW_MINUTES);
  const to = minutesAfter(target, WINDOW_MINUTES);

  // console.log("DEBUG: fetchEventsToNotify interval:", from.toISOString(), "->", to.toISOString());

  const events = await prisma.event.findMany({
    where: {
      startsAt: {
        gte: from,
        lte: to,
      },
    },
  });
  
  // Filtrar eventos que já foram notificados nesta sessão
  return events.filter(event => !notifiedEventIds.has(event.id));
}

async function workerIteration() {
  try {
    console.log("DEBUG: workerIteration started — searching for events...");
    const events = await fetchEventsToNotify();
    // console.log("DEBUG: events found:", events.length);
    
    if (!events.length) {
      // console.log("No events to notify now.");
      return;
    }

    const users = await prisma.user.findMany();
    console.log("DEBUG: users found:", users.length);
    
    if (!users.length) {
      console.log("No users found to send notifications.");
      return;
    }

    console.log(`Found ${events.length} events. Sending to ${users.length} users...`);

    for (const event of events) {
      for (const user of users) {
        try {
          await sendEmailReminder(user, event);
          await new Promise((r) => setTimeout(r, 300));
        } catch (err) {
          console.error(`Failed to send to ${user.email} for event ${event.id}. Continuing...`);
        }
      }
      // Marcar como notificado nesta sessão
      notifiedEventIds.add(event.id);
      console.log(`Event ${event.id} marked as notified in this session`);
    }
  } catch (err) {
    console.error("Error in workerIteration:", err);
  }
}

export async function startJobs({ runImmediateInDev = true } = {}) {
  await initializeEmailTransport();

  cron.schedule("0 9 * * *", () => {
    console.log("Cron fired at 09:00 — checking events...");
    workerIteration().catch((err) => console.error("Error in scheduled worker:", err));
  });

  if (process.env.NODE_ENV !== "production" && runImmediateInDev) {
    try {
      console.log("Development environment: checking email transporter...");
      const verified = await verifyEmailTransport();
      
      console.log("Running workerIteration() immediately for testing.");
      await workerIteration();
    } catch (err) {
      console.error("Error running workerIteration() in dev:", err);
    }
  }

  console.log("UserReminder jobs started.");
}

export async function sendTestEmail() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user in database for testing.");
    return;
  }

  const event = {
    title: "Test Event",
    location: "Main Auditorium",
    startsAt: new Date(),
  };

  try {
    const verified = await verifyEmailTransport();
    if (!verified) {
      console.error("Email transport verification failed.");
      return;
    }

    await sendEmailReminder(user, event);
    console.log("Test email sent successfully.");
  } catch (err) {
    console.error("Error sending test email:", err);
  }
}

if (process.argv[1] && process.argv[1].includes("UserReminder")) {
  (async () => {
    try {
      await startJobs({ runImmediateInDev: false });
      await sendTestEmail();
      console.log("Direct UserReminder execution completed (test mode).");
    } catch (err) {
      console.error("Error executing UserReminder directly:", err);
      process.exit(1);
    }
  })();
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
