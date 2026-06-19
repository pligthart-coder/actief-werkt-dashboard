import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const entities = await prisma.migrationEntity.findMany({
      orderBy: [
        { date: 'asc' },
        { startActivity: 'asc' }
      ]
    });
    return NextResponse.json(entities);
  } catch (error) {
    console.error("Error fetching migration entities:", error);
    return NextResponse.json(
      { error: "Failed to fetch migration entities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activity, field, value } = body;

    const updateData: any = {
      [field]: value,
      updatedBy: "anonymous",
    };

    // Add timestamp for status changes
    if (field === 'readyForTest' && value) {
      updateData.readyForTestDate = new Date();
    } else if (field === 'ok' && value) {
      updateData.okDate = new Date();
      updateData.notOk = false;
      updateData.notOkDate = null;
    } else if (field === 'notOk' && value) {
      updateData.notOkDate = new Date();
      updateData.ok = false;
      updateData.okDate = null;
    } else if (field === 'approval' && value) {
      updateData.approvalDate = new Date();
    }

    const entity = await prisma.migrationEntity.update({
      where: { activity },
      data: updateData,
    });

    return NextResponse.json(entity);
  } catch (error) {
    console.error("Error updating migration entity:", error);
    return NextResponse.json(
      { error: "Failed to update migration entity" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const entities = await request.json();
    
    // Initialize database with default entities
    for (const entity of entities) {
      await prisma.migrationEntity.upsert({
        where: { activity: entity.activity },
        update: entity,
        create: entity,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error initializing migration entities:", error);
    return NextResponse.json(
      { error: "Failed to initialize migration entities" },
      { status: 500 }
    );
  }
}
