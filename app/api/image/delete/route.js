import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function DELETE(request) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return Response.json({ error: "File ID is required" }, { status: 400 });
    }

    const result = await new Promise((resolve, reject) => {
      imagekit.deleteFile(fileId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error in deleteFile API:", error);
    const errorMessage =
      error.message ||
      (error.errors && error.errors[0] && error.errors[0].message) ||
      "Failed to delete file";
    const errorStatus = error.httpStatusCode || 500;
    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}
