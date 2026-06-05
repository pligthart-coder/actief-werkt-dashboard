import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("=== Nieuwe gebruiker aanmaken ===\n");

  const name = await question("Naam: ");
  const email = await question("Email: ");
  const password = await question("Wachtwoord: ");

  if (!email || !password) {
    console.error("\n❌ Email en wachtwoord zijn verplicht!");
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.error("\n❌ Gebruiker met dit email bestaat al!");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || undefined,
    },
  });

  console.log("\n✅ Gebruiker succesvol aangemaakt!");
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Naam: ${user.name || "(geen naam)"}\n`);

  rl.close();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("\n❌ Fout bij aanmaken gebruiker:", error);
  process.exit(1);
});
