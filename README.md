# Panduan Penggunaan Sistem SPK BANSOS (Metode VIKOR)

Selamat datang di Sistem Pendukung Keputusan (SPK) untuk Penilaian Kelayakan Penerima Bantuan Sosial. Sistem ini menggunakan metode **VIKOR** (*VlseKriterijumska Optimizacija I Kompromisno Resenje*) untuk menentukan prioritas penerima bantuan berdasarkan kriteria yang telah ditentukan.

Dokumen ini menjelaskan cara penggunaan sistem secara detail, mulai dari pengaturan kriteria hingga proses perhitungan.

---

## 1. Dashboard Utama
Halaman ini menampilkan ringkasan data:
- Jumlah Kriteria yang aktif.
- Jumlah Calon Penerima (Alternatif) yang terdaftar.
- Navigasi cepat ke fitur-fitur utama.

---

## 2. Manajemen Kriteria (`/criteria`)
Menu ini digunakan untuk menentukan parameter apa saja yang menjadi dasar penilaian.

### Cara Menambah Kriteria:
1. Klik tombol **"Tambah Kriteria"**.
2. Isi formulir yang tersedia:
   - **Nama Kriteria**: Contoh: *Penghasilan*, *Jumlah Tanggungan*, *Kondisi Rumah*.
   - **Bobot (Weight)**: Nilai antara **0 sampai 1**.
   - **Tipe (Type)**: Pilih *Benefit* atau *Cost*.
   - **Keterangan**: Penjelasan tambahan (opsional).

### 💡 Penjelasan Detail: Kenapa Bobot harus 0 - 1?
Dalam sistem pendukung keputusan, bobot merepresentasikan **tingkat kepentingan** atau prioritas sebuah kriteria dibanding kriteria lainnya.

*   Nilai **0** berarti tidak penting sama sekali (0%).
*   Nilai **1** berarti mutlak paling penting (100%).
*   Secara ideal, **total jumlah bobot dari seluruh kriteria harus bernilai 1 (atau mendekati 1)**.

**Contoh Pembagian Bobot:**
Misalkan kita punya 3 kriteria untuk menentukan warga miskin:
1.  **Penghasilan** (Sangat Penting) -> Bobot: **0.5** (50%)
2.  **Jumlah Tanggungan** (Penting) -> Bobot: **0.3** (30%)
3.  **Kondisi Rumah** (Cukup Penting) -> Bobot: **0.2** (20%)
    *   *Total: 0.5 + 0.3 + 0.2 = 1.0*

### 💡 Penjelasan Tipe: Benefit vs Cost
*   **Benefit (Keuntungan)**: Semakin **besar** nilainya, semakin **layak** dia menerima bantuan.
    *   *Contoh*: Jumlah Tanggungan (semakin banyak anak, semakin butuh bantuan), Usia (semakin tua, semakin prioritas).
*   **Cost (Biaya/Beban)**: Semakin **kecil** nilainya, semakin **layak** dia menerima bantuan (atau sebaliknya, nilai besar justru mengurangi kelayakan).
    *   *Contoh*: Penghasilan (semakin kecil penghasilan, semakin butuh bantuan). Jika inputnya adalah angka nominal penghasilan (misal Rp 3.000.000), maka ini adalah *Cost*, karena kita mencari yang penghasilannya rendah.

---

## 3. Data Penerima / Alternatif (`/alternatives`)
Menu ini digunakan untuk memasukkan data warga yang akan dinilai.

### Cara Menambah Data Penerima:
1. Klik tombol **"Tambah Penerima"**.
2. Isi **Informasi Dasar**:
   - Nama Lengkap.
   - Alamat.
   - Keterangan (misal: Pekerjaan).
3. Isi **Nilai Penilaian** untuk setiap kriteria yang sudah dibuat sebelumnya.

**Contoh Pengisian Nilai:**
Jika kriteria Anda adalah:
1.  **Penghasilan (Cost)**: Input angka skala 1-5 atau nominal. Agar konsisten, disarankan menggunakan **skala**.
    *   1 = < Rp 500rb
    *   2 = Rp 500rb - 1jt
    *   3 = Rp 1jt - 2jt
    *   dst.
2.  **Jumlah Tanggungan (Benefit)**: Input jumlah orang (misal: 4 orang).

> **PENTING**: Pastikan semua calon penerima memiliki nilai di setiap kriteria agar perhitungan akurat.

---

## 4. Perhitungan VIKOR (`/calculation`)
Setelah data Kriteria dan Alternatif lengkap, masuk ke menu ini untuk melihat hasil perankingannya.

### Tahapan Perhitungan (Otomatis oleh Sistem):
Sistem akan melakukan langkah-langkah berikut secara otomatis:

1.  **Matriks Keputusan**: Mengumpulkan semua nilai input.
2.  **Normalisasi Matriks**: Mengubah nilai-nilai input menjadi skala yang seragam agar bisa dibandingkan.
3.  **Matriks Ternormalisasi Terbobot**: Mengalikan nilai normalisasi dengan bobot kriteria (0-1 tadi).
4.  **Menghitung Nilai S dan R**:
    *   **S (Utility Measure)**: Mengukur rata-rata kepuasan kelompok.
    *   **R (Regret Measure)**: Mengukur penyesalan individu maksimal.
5.  **Menghitung Indeks VIKOR (Q)**: Nilai akhir yang menentukan peringkat.

### Cara Membaca Hasil:
*   Lihat tabel **Hasil Perankingan Akhir**.
*   Urutan **Ranking 1** adalah penerima yang **paling direkomendasikan** oleh sistem.
*   **Nilai Q (Indeks VIKOR)**: Semakin **kecil** nilai Q, semakin baik peringkatnya (semakin layak menerima bantuan).
    *   Q = 0 adalah solusi ideal (paling layak).
    *   Q = 1 adalah solusi terburuk.

---

## Ringkasan Alur Kerja
1.  Buka menu **Kriteria**. Pastikan kriteria sudah sesuai (misal: Penghasilan, Tanggungan, dll) dan bobot totalnya 1.
2.  Buka menu **Data Penerima**. Masukkan data warga dan beri nilai untuk masing-masing kriteria.
3.  Buka menu **Perhitungan**. Klik tombol "Hitung / Refresh" jika diperlukan.
4.  Lihat hasil **Ranking 1** sebagai rekomendasi utama penerima bantuan.
