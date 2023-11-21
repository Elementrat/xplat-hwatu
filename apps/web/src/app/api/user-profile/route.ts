import connectDB from "@/app/lib/connect-db";
import { createErrorResponse } from "@/app/lib/util";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { updateCardProgress } from "@/app/lib/user-profile-db";

// ID = userID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const userID = session?.user?.id;

    if (!userID) {
      return createErrorResponse("Sign in to update profile", 400);
    }

    const body = await request.json();

    if (!body.cards) {
      return createErrorResponse("Cards needed", 400);
    }

    const { error } = await updateCardProgress(userID, {
      cards: body.cards
    });

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      data: {}
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return createErrorResponse("Card with title already exists", 409);
    }

    return createErrorResponse(error.message, 500);
  }
}
