import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.checklistItem.findMany();
    const itemsMap: Record<string, boolean> = {};
    items.forEach((item: { itemId: string; completed: boolean }) => {
      itemsMap[item.itemId] = item.completed;
    });

    return NextResponse.json(itemsMap);
  } catch (error) {
    console.error("Error fetching checklist:", error);
    return NextResponse.json(
      { error: "Failed to fetch checklist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { itemId, completed } = await request.json();

    const item = await prisma.checklistItem.upsert({
      where: { itemId },
      update: {
        completed,
        updatedBy: "anonymous",
      },
      create: {
        itemId,
        completed,
        updatedBy: "anonymous",
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating checklist:", error);
    return NextResponse.json(
      { error: "Failed to update checklist" },
      { status: 500 }
    );
  }
}
