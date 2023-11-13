import connectDB from "@/app/lib/connect-db";
import { deleteTag, getTag, updateTag } from "@/app/lib/tag-db";
import { createErrorResponse } from "@/app/lib/util";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;
    const { tag, error } = await getTag(id);

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      data: {
        tag
      }
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    if (typeof error === "string" && error.includes("Tag not found")) {
      return createErrorResponse("Tag not found", 404);
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
    const { cards } = body;
    const { tag, error } = await updateTag(id, { cards });

    if (error) {
      throw error;
    }

    let json_response = {
      status: "success",
      data: {
        tag
      }
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    if (typeof error === "string" && error.includes("Tag not found")) {
      return createErrorResponse("Tag not found", 404);
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

    const { error } = await deleteTag(id);

    if (error) {
      throw error;
    }

    return new NextResponse("deleted", { status: 200 });
  } catch (error: any) {
    if (typeof error === "string" && error.includes("Tag not found")) {
      return createErrorResponse("Tag not found", 404);
    }

    return createErrorResponse(error.message, 500);
  }
}
