import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo12345", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@widgetplatform.dev" },
    update: {},
    create: {
      name: "Demo Owner",
      email: "demo@widgetplatform.dev",
      passwordHash,
    },
  });

  await prisma.widget.upsert({
    where: { id: "seed-widget-1" },
    update: {},
    create: {
      id: "seed-widget-1",
      tenantId: user.id,
      type: "SIGNUP_FORM",
      title: "Newsletter Signup",
      description: "Join our newsletter for updates.",
      buttonText: "Subscribe",
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
      ],
    },
  });

  console.log("Seed complete. Login with demo@widgetplatform.dev / demo12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
