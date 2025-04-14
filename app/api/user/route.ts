import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Define a TypeScript interface for your user document
interface UserDocument {
  _id: ObjectId;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  passwordHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET(request: Request) {
  try {
    // Get the session to check if the user is logged in.
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== "object" || !("user" in session) || !(session.user as { id: string }).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;

    // Connect to MongoDB and get the user document.
    const client = await clientPromise;
    const db = client.db("insighthink");
    const collection = db.collection<UserDocument>("Users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build a response object without sensitive fields.
    const responseUser = {
      _id: user._id.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(responseUser, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/user error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Check that the user is authenticated.
    const session = await getServerSession(authOptions) as { user?: { id?: string } };
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;

    // Parse the JSON body of the request.
    const body = await request.json();
    // Only allow updating these fields.
    const { username, firstName, lastName, email, avatarUrl } = body;

    // Prepare the update object.
    const updateData: Partial<UserDocument> = {};
    if (username !== undefined) updateData.username = username;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    updateData.updatedAt = new Date();

    // Connect to MongoDB.
    const client = await clientPromise;
    const db = client.db("insighthink");
    const collection = db.collection<UserDocument>("Users");

    // Update the user document.
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No changes made or update failed" },
        { status: 400 }
      );
    }

    // Optionally fetch the updated user data to return.
    const updatedUser = await collection.findOne({ _id: new ObjectId(userId) });
    const responseUser = {
      _id: updatedUser?._id.toString(),
      username: updatedUser?.username,
      firstName: updatedUser?.firstName,
      lastName: updatedUser?.lastName,
      email: updatedUser?.email,
      avatarUrl: updatedUser?.avatarUrl,
      createdAt: updatedUser?.createdAt,
      updatedAt: updatedUser?.updatedAt,
    };

    return NextResponse.json(
      { message: "User updated successfully", user: responseUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/user error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
