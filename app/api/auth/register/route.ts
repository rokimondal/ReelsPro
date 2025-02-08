import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from '@/lib/db'
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password is required" },
                { status: 400 }
            )
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email is already exist" },
                { status: 400 }
            )
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "failed to registered User" },
            { status: 500 }
        )
    }
}