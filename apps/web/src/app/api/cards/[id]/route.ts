import connectDB from "@/app/lib/connect-db";
import { deleteCard, getCard, updateCard } from "@/app/lib/card-db";
import { createErrorResponse } from "@/app/lib/util";
import { NextResponse } from "next/server";

import { setGlobalOptions } from "@typegoose/typegoose";

setGlobalOptions({ globalOptions: { disableGlobalCaching: true } }); // does not affect the previous setting of "options"

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;
    const { card, error } = await getCard(id);

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      data: {
        card
      }
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    if (typeof error === "string" && error.includes("Card not found")) {
      return createErrorResponse("Card not found", 404);
    }

    return createErrorResponse(error.message, 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;
    let body = await request.json();

    const { card, error } = await getCard(id);

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      data: {
        card
      }
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    if (typeof error === "string" && error.includes("Todo not found")) {
      return createErrorResponse("Todo not found", 404);
    }

    return createErrorResponse(error.message, 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;

    const { error } = await deleteCard(id);

    if (error) {
      throw error;
    }

    return new NextResponse("deleted", { status: 200 });
  } catch (error: any) {
    if (typeof error === "string" && error.includes("Card not found")) {
      return createErrorResponse("Card not found", 404);
    }

    return createErrorResponse(error.message, 500);
  }
}
