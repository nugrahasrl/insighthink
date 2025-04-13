// app/launh-article/page.tsx
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// Jika ingin menggunakan gambar, aktifkan import berikut:
// import Image from "next/image"

export default function LaunhArticlePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Bagian Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Mengenal Insighthink</h1>
        <p className="text-muted-foreground text-lg">
          Solusi praktis untuk Anda yang sibuk namun ingin terus menambah wawasan
        </p>
      </header>

      <Separator className="mb-8" />

      {/* Bagian Konten 3 Kolom */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Kolom 1 */}
        <div className="rounded-md border p-4 shadow-sm bg-card text-card-foreground">
          <h2 className="text-xl font-semibold mb-2">
            Baca Buku Tanpa menghabiskan waktumu
          </h2>
          <p className="text-sm text-muted-foreground">
            Di Insighthink, Anda bisa menikmati ringkasan dan insight penting dari berbagai buku
            tanpa perlu membaca semuanya. Sempurna bagi Anda yang ingin terus belajar namun memiliki
            keterbatasan waktu.
          </p>
        </div>

        {/* Kolom 2 */}
        <div className="rounded-md border p-4 shadow-sm bg-card text-card-foreground">
          <h2 className="text-xl font-semibold mb-2">
            Baca dan sharing artikel yang Kamu tulis dengan temanmu
          </h2>
          <p className="text-sm text-muted-foreground">
            Insighthink juga mendukung komunitas penulis. Anda bisa menulis artikel, membagikan
            wawasan, dan berdiskusi dengan pembaca lain. Mari tumbuh bersama dan saling berbagi
            inspirasi.
          </p>
        </div>

        {/* Kolom 3 */}
        <div className="rounded-md border p-4 shadow-sm bg-card text-card-foreground">
          <h2 className="text-xl font-semibold mb-2">
            Kurasi Konten YouTube yang Menambah Wawasanmu
          </h2>
          <p className="text-sm text-muted-foreground">
            Bagi Anda yang lebih suka menonton atau mendengarkan, kami juga menyiapkan kurasi video
            dan podcast dari berbagai channel YouTube. Semua dirangkum sehingga Anda dapat belajar
            secara praktis.
          </p>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Bagian Aksi / CTA */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tertarik Bergabung?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Dapatkan ringkasan buku, artikel, dan konten menarik lainnya. Mari kita
          perluas wawasan bersama Insighthink.
        </p>
        <Button asChild>
          <a href="/signup">Daftar Sekarang</a>
        </Button>
      </div>
    </div>
  )
}
