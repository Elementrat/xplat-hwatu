import connectDB from "@/app/lib/connect-db";
import { createCard, deleteAllCards, getCards } from "@/app/lib/card-db";
import { createErrorResponse } from "@/app/lib/util";
import { NextRequest, NextResponse } from "next/server";

const LIMIT = 99999;

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const page_str = request.nextUrl.searchParams.get("page");
    const limit_str = request.nextUrl.searchParams.get("limit");

    const page = page_str ? parseInt(page_str, 10) : 1;
    const limit = limit_str ? parseInt(limit_str, 10) : LIMIT;

    const { cards, results, error } = await getCards({ page, limit });

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      results,
      cards
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return createErrorResponse(error.message, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { error } = await deleteAllCards();

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

    const body = await request.json();

    if (!body.title) {
      return createErrorResponse("Card must have a title", 400);
    }

    const { card, error } = await createCard(body.title);
    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      data: {
        card
      }
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
