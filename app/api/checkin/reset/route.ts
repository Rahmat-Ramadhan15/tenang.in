import { NextResponse } from "next/server";
import { history } from "@/lib/store";
import { success } from "@/lib/utils/apiResponse";

export async function DELETE() {
  history.length = 0;

  return NextResponse.json(
    success(null, "Semua history berhasil dihapus")
  );
}