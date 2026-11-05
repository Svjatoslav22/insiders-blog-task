import { Role } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";

async function main(): Promise<void> {
  const adminEmail = "admin@example.com";
  const adminPassword = "adminSecret123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin already exists: ${adminEmail}`);
    return;
  }

  const hashedPassword = await hashPassword(adminPassword);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: "Super Admin",
      role: Role.ADMIN,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log("✅ Admin user seeded successfully:", admin);
}

main()
  .catch((error: unknown) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });