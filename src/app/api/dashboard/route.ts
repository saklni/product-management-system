import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User";

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

    const [totalProducts, totalCategories, totalUsers, products] =
      await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        User.countDocuments(),
        Product.find().lean(),
      ]);

    const totalValue = products.reduce(
      (sum: number, p: any) => sum + (p.price || 0) * (p.stock || 0),
      0
    );

    const lowStockProducts = products.filter(
      (p: any) => (p.stock || 0) <= 5
    ).length;

    const recentProducts = await Product.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalValue,
        lowStockProducts,
        recentProducts,
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
