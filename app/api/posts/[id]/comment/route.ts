import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { withProfileId } from "../../../util/backendUtils";

const prisma = new PrismaClient();



export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "postId missing in route params" },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: "desc" },
      include: { user: true }, // pull commenter name/id in one query
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("[comment.GET]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
/**
 * POST /api/posts/[postId]/comments
 * ---------------------------------
 * Creates a new comment on the post. The request body should be JSON with a
 * single `content` field. The helper `withProfileId` augments the data with the
 * currently‑authenticated profileId (inferred from cookies/session) so the
 * client never needs to send it explicitly.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { content } = (await req.json()) as { content: string };
    if (!content || content.trim().length === 0) {
      return new NextResponse("Comment content required", { status: 400 });
    }

    const dataWithProfile = await withProfileId({
      postId: id,
      content: content.trim(),
    });

    const created = await prisma.comment.create({
      data: dataWithProfile,
      include: { user: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Error creating comment", err);
    return new NextResponse("Unable to create comment", { status: 500 });
  }
}