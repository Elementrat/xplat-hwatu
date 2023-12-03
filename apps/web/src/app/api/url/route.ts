import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createErrorResponse } from "@/app/lib/util";
import { CONSTANTS } from "xplat-lib";

const parseTitle = (body: string) => {
  let match = body.match(/<title>([^<]*)<\/title>/); // regular expression to parse contents of the <title> tag
  if (!match || typeof match[1] !== "string")
    throw new Error("Unable to parse the title tag");
  return match[1];
};

export async function GET(request: NextRequest) {
  try {
    const requestedURL = request.nextUrl.searchParams.get(CONSTANTS.URL);

    if (!requestedURL) {
      return createErrorResponse("url required", 400);
    }

    const res = await fetch(requestedURL);
    const text = await res.text();
    const title = parseTitle(text);

    let json_response = {
      status: "success",
      title: title
    };

    return NextResponse.json(json_response);
  } catch (error: any) {
    return createErrorResponse(error.message, 500);
  }
}
