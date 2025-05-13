import ImageKit from "imagekit";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function DELETE(request) {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("csrf-token-expeditionz")?.value;
  const tokenFromHeader = request.headers.get("X-CSRF-Token");

  // if (
  //   !tokenFromCookie ||
  //   !tokenFromHeader ||
  //   tokenFromCookie !== tokenFromHeader
  // ) {
  //   console.error("CSRF Token Mismatch or Missing", {
  //     tokenFromCookiePresent: !!tokenFromCookie,
  //     tokenFromHeaderPresent: !!tokenFromHeader,
  //   });
  //   return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  // }
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return Response.json({ error: "File ID is required" }, { status: 400 });
    }
    let actualFileId;
    try {
      actualFileId = fileId;
      if (!actualFileId) {
        throw new Error("Could not parse fileId from URL path.");
      }
    } catch (parseError) {
      console.error(
        "Error parsing fileId from URL:",
        parseError,
        "Received URL:",
        fileId
      );
      return NextResponse.json(
        {
          error:
            "Invalid fileId format. Full URL was received, could not extract fileId.",
        },
        { status: 400 }
      );
    }

    console.log(`Attempting to delete ImageKit fileId: ${actualFileId}`);
    const result = await new Promise((resolve, reject) => {
      imagekit.deleteFile(actualFileId, (error, result) => {
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
    const errorStatus = error.httpStatusCode || 500; // ImageKit errors might have httpStatusCode
    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}
