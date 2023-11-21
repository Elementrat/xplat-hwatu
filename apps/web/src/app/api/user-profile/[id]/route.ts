import connectDB from "@/app/lib/connect-db";
import { createCard, deleteAllCards, getCards } from "@/app/lib/card-db";
import { createErrorResponse } from "@/app/lib/util";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { getUserProfile } from "@/app/lib/user-profile-db";

const LIMIT = 99999;

// ID = userID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!params.id) {
      throw "Proide an ID";
    }

    const { userProfile, error } = await getUserProfile({ userID: params.id });

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      userProfile: userProfile
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return createErrorResponse(error.message, 500);
  }
}
