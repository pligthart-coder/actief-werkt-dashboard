import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(request: Request) {
  // Simple security: only allow in development or with a secret key
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  
  if (process.env.NODE_ENV === "production" && secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { stdout, stderr } = await execAsync("npx prisma migrate deploy");
    
    return NextResponse.json({
      success: true,
      message: "Migrations completed successfully",
      output: stdout,
      errors: stderr || null,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      output: error.stdout,
      errors: error.stderr,
    }, { status: 500 });
  }
}
