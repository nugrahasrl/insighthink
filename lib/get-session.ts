import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

// Tambahkan tipe return untuk membantu TypeScript (opsional)
export async function getSession(): Promise<any> {
  return await getServerSession(authOptions);
}
