import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectDB();
    const body = await request.json();

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: (session.user as any).id },
      body,
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectDB();

    const product = await Product.findOneAndDelete({
      _id: id,
      userId: (session.user as any).id,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
