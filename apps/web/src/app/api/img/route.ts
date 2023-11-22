import { createErrorResponse } from "@/app/lib/util";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import B2 from "backblaze-b2";
import { v4 as uuid } from "uuid";

const UPLOAD_BUCKET_NAME = "hwatu-uploads";
const UPLOAD_BUCKET_ID = "963e1579bea5fe3d8db50f10";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_KEY_ID, // or accountId: 'accountId'
  applicationKey: process.env.BACKBLAZE_APPLICATION_KEY // or masterApplicationKey
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userID = session?.user?.id;

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!userID) {
      return createErrorResponse("Sign in to upload", 400);
    }

    if (!request.body) {
      return createErrorResponse("No Data", 500);
    }

    await b2.authorize(); // must authorize first (authorization lasts 24 hrs)

    let uploadURLResponse = await b2.getUploadUrl({
      bucketId: UPLOAD_BUCKET_ID
    });

    if (!uploadURLResponse.data) {
      throw "Something went wrong";
    }

    const { authorizationToken, uploadUrl } = uploadURLResponse.data;

    const buffers = [];

    for await (const data of request.body as any) {
      buffers.push(data);
    }

    const finalBuffer = Buffer.concat(buffers);

    const fileName = `${uuid()}-${filename}`;

    const uploadFileResponse = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      filename: fileName,
      data: finalBuffer
    });

    if (!uploadFileResponse.data.fileId) {
      throw "no fileID in store";
    }

    const fileId = uploadFileResponse?.data?.fileId;

    const fileInfoResponse = await b2.getFileInfo({
      fileId
    });

    const cloudFileName = fileInfoResponse?.data?.fileName;

    const friendlyFilePath = `https://f005.backblazeb2.com/file/hwatu-uploads/${cloudFileName}`;

    let json_response = {
      status: "success",
      data: {
        uploadURL: friendlyFilePath
      }
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return createErrorResponse("Image with title already exists", 409);
    }

    return createErrorResponse(error.message, 500);
  }
}
