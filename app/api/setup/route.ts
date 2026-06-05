import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Try to create tables by running a simple query
    // This will work if migrations have been applied
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ChecklistItem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "itemId" TEXT NOT NULL UNIQUE,
        "completed" BOOLEAN NOT NULL DEFAULT false,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "updatedBy" TEXT
      );
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "ChecklistItem_itemId_idx" ON "ChecklistItem"("itemId");
    `;

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully!",
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    
    // If tables already exist, that's okay
    if (error.message?.includes("already exists")) {
      return NextResponse.json({
        success: true,
        message: "Database already set up!",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to set up database",
      },
      { status: 500 }
    );
  }
}
