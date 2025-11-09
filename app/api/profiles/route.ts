import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, data, isEncrypted } = body;

    // Validate input
    if (!nickname || typeof nickname !== "string" || nickname.trim().length === 0) {
      return NextResponse.json(
        { error: "Nickname is required" },
        { status: 400 }
      );
    }

    if (!data || typeof data !== "string") {
      return NextResponse.json(
        { error: "Data is required" },
        { status: 400 }
      );
    }

    // Generate short ID (8 characters)
    let shortId = nanoid(8);

    // Ensure uniqueness
    let existing = await prisma.profile.findUnique({ where: { shortId } });
    while (existing) {
      shortId = nanoid(8);
      existing = await prisma.profile.findUnique({ where: { shortId } });
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        shortId,
        nickname: nickname.trim(),
        data,
        isEncrypted: isEncrypted || false,
      },
    });

    return NextResponse.json(
      {
        shortId: profile.shortId,
        message: "Profile created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
