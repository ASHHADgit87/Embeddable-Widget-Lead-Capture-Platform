import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const widget = await prisma.widget.findUnique({
    where: { id: "seed-widget-1" },
  });
  if (!widget) {
    console.error(
      "Run `npx prisma db seed` first to create the base user and widget.",
    );
    process.exit(1);
  }

  const sampleCountries = [
    { country: "United States", region: "California", city: "San Francisco" },
    { country: "Pakistan", region: "Sindh", city: "Karachi" },
    { country: "Germany", region: "Berlin", city: "Berlin" },
    { country: null, region: null, city: null },
  ];

  for (let i = 0; i < 12; i += 1) {
    const sample = sampleCountries[i % sampleCountries.length]!;
    await prisma.submission.create({
      data: {
        widgetId: widget.id,
        tenantId: widget.tenantId,
        data: { email: `visitor${i}@example.com` },
        ipAddress: "203.0.113.10",
        country: sample.country,
        region: sample.region,
        city: sample.city,
        geoProvider: sample.country ? "ip-api.com" : null,
        geoFailed: !sample.country,
        notifySent: i % 5 !== 0,
        notifyError: i % 5 === 0 ? "Simulated notification failure" : null,
      },
    });
  }

  console.log("Seeded 12 demo submissions.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
