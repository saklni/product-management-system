import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

interface LeanProduct {
  price?: number;
  stock?: number;
}

interface LeanTransaction {
  totalPrice?: number;
  createdAt: Date | string;
}

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

    const userId = session.user.id;
    const [totalProducts, totalCategories, totalUsers, rawProducts, rawTransactions] =
      await Promise.all([
        Product.countDocuments({ userId }),
        Category.countDocuments({ userId }),
        User.countDocuments({ _id: userId }), // Cuma akan hitung 1 untuk user itu sendiri
        Product.find({ userId }).lean(),
        Transaction.find({ userId }).lean(),
      ]);

    const products = rawProducts as unknown as LeanProduct[];
    const transactions = rawTransactions as unknown as LeanTransaction[];

    const totalValue = products.reduce(
      (sum: number, p: LeanProduct) => sum + (p.price || 0) * (p.stock || 0),
      0
    );

    const lowStockProducts = products.filter(
      (p: LeanProduct) => (p.stock || 0) <= 5
    ).length;

    const recentProducts = await Product.find({ userId: session.user.id })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce(
      (sum: number, t: LeanTransaction) => sum + (t.totalPrice || 0),
      0
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayRevenue = transactions
      .filter((t: LeanTransaction) => new Date(t.createdAt) >= startOfToday)
      .reduce((sum: number, t: LeanTransaction) => sum + (t.totalPrice || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalValue,
        lowStockProducts,
        recentProducts,
        totalTransactions,
        totalRevenue,
        todayRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
