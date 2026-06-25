import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const transactions = await Transaction.find({ userId: (session.user as any).id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { items, totalPrice } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Keranjang kosong" },
        { status: 400 }
      );
    }

    // Generate Invoice Number: INV-YYYYMMDD-HHMMSS-RANDOM
    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateStr = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    const randStr = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const invoiceString = `INV-${dateStr}-${timeStr}-${randStr}`;

    // Verify stock
    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        userId: (session.user as any).id,
      });
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Produk ${item.productName} tidak ditemukan` },
          { status: 404 }
        );
      }
      if (product.stock < item.qty) {
        return NextResponse.json(
          { success: false, message: `Stok produk ${item.productName} tidak mencukupi (Tersedia: ${product.stock})` },
          { status: 400 }
        );
      }
    }

    // Decrement stocks
    for (const item of items) {
      await Product.findOneAndUpdate(
        { _id: item.productId, userId: (session.user as any).id },
        { $inc: { stock: -item.qty } }
      );
    }

    // Save transaction
    const transaction = await Transaction.create({
      invoiceNumber: invoiceString,
      items,
      totalPrice,
      userId: (session.user as any).id,
    });

    return NextResponse.json(
      { success: true, data: transaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
