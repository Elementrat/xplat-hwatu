import connectDB from "@/app/lib/connect-db";
import { createTag, deleteAllTags, getTags } from "@/app/lib/tag-db";
import { createErrorResponse } from "@/app/lib/util";
import { NextRequest, NextResponse } from "next/server";
import { CONSTANTS } from "xplat-lib";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";

const LIMIT = 99999;

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const page_str = request.nextUrl.searchParams.get(CONSTANTS.PAGE);
    const limit_str = request.nextUrl.searchParams.get(CONSTANTS.LIMIT);
    const userID = request.nextUrl.searchParams.get(CONSTANTS.USER_ID);

    const page = page_str ? parseInt(page_str, 10) : 1;
    const limit = limit_str ? parseInt(limit_str, 10) : LIMIT;

    if (!userID) {
      throw "Provide a userID";
    }

    const { tags, results, error } = await getTags({ page, limit, userID });

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      results,
      tags
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return createErrorResponse(error.message, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { error } = await deleteAllTags();

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success"
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return createErrorResponse(error.message, 500);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const userID = session?.user?.id;

    if (!userID) {
      return createErrorResponse("Sign in to create tags", 400);
    }

    const body = await request.json();

    if (!body.title) {
      return createErrorResponse("tag must have a title", 400);
    }

    const { tag, error } = await createTag({
      title: body.title,
      cards: body.cards,
      color: body.color,
      userID
    });
    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      data: {
        tag
      }
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return createErrorResponse("Tag with title already exists", 409);
    }

    return createErrorResponse(error.message, 500);
  }
}
