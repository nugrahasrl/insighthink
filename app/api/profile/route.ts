import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const data = await request.json()
    console.log("Update data received:", data)

    // Connect to database
    const client = await clientPromise
    const db = client.db("insighthink")

    // Update user in database
    const result = await db.collection("Users").updateOne(
      { _id: new ObjectId(data.id) },
      {
        $set: {
          name: data.name,
          email: data.email,
          username: data.username,
          role: data.role,
          updatedAt: new Date(),
        },
      },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made or user not found" }, { status: 404 })
    }

    // Fetch the updated user to return
    const updatedUser = await db.collection("Users").findOne({ _id: new ObjectId(data.id) })

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          username: updatedUser.username,
          role: updatedUser.role,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

