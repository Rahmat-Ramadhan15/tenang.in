import { NextResponse } from "next/server";
import { history } from "@/lib/store";
import { success, error } from "@/lib/utils/apiResponse";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const item = history.find((d) => d.id === params.id);

  if (!item) {
    return NextResponse.json(error("Data tidak ditemukan"), {
      status: 404,
    });
  }

  return NextResponse.json(
    success(item, "Berhasil ambil detail")
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const index = history.findIndex((d) => d.id === params.id);

  if (index === -1) {
    return NextResponse.json(error("Data tidak ditemukan"), {
      status: 404,
    });
  }

  const deleted = history[index];
  history.splice(index, 1);

  return NextResponse.json(
    success(deleted, "Berhasil dihapus")
  );
}