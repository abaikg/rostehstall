import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Файл не найден" }, { status: 400 });

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type))
      return NextResponse.json({ error: "Недопустимый формат. Используйте JPG, PNG или WebP" }, { status: 400 });

    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ error: "Файл слишком большой. Максимум 5 МБ" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `product-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 });
  }
}
