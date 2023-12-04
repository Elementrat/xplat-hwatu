import connectDB from "@/app/lib/connect-db";
import { createErrorResponse } from "@/app/lib/util";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import {
  updateCardProgress,
  updateThemePreference
} from "@/app/lib/user-profile-db";

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

    if (
      body["cards"] === undefined &&
      body["themeColorPreference"] === undefined
    ) {
      return createErrorResponse("Cards or theme color needed", 400);
    }

    if (body.cards) {
      const { error } = await updateCardProgress(userID, {
        cards: body.cards
      });

      if (error) {
        throw error;
      }
    }

    if (body["themeColorPreference"] !== undefined) {
      const { error } = await updateThemePreference(userID, {
        themeColorPreference: body.themeColorPreference as string
      });

      if (error) {
        throw error;
      }
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
      return createErrorResponse("profile already exists", 409);
    }

    return createErrorResponse(error.message, 500);
  }
}
