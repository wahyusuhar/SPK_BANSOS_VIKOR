# Panduan Penggunaan Sistem SPK BANSOS (Metode VIKOR)

Selamat datang di Sistem Pendukung Keputusan (SPK) untuk Penilaian Kelayakan Penerima Bantuan Sosial. Sistem ini menggunakan metode **VIKOR** (_VlseKriterijumska Optimizacija I Kompromisno Resenje_) untuk menentukan prioritas penerima bantuan berdasarkan kriteria yang telah ditentukan.

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
   - **Nama Kriteria**: Contoh: _Penghasilan_, _Jumlah Tanggungan_, _Kondisi Rumah_.
   - **Bobot (Weight)**: Nilai antara **0 sampai 1**.
   - **Tipe (Type)**: Pilih _Benefit_ atau _Cost_.
   - **Keterangan**: Penjelasan tambahan (opsional).

### 💡 Penjelasan Detail: Kenapa Total Bobot Harus 1.0?

Sistem akan menampilkan pesan: _"Pastikan total bobot disarankan mendekati 1.0"_. Ini adalah prinsip dasar dalam sistem pengambilan keputusan.

**Mengapa harus 1.0 (100%)?**
Dalam matematika pengambilan keputusan (MCDM), bobot melambangkan **proporsi kepentingan** yang jika dijumlahkan harus membentuk satu kesatuan utuh (100%).

- Jika total bobot < 1.0 (misal 0.8), berarti ada 20% faktor penentu keputusan yang "hilang" atau tidak dihitung.
- Jika total bobot > 1.0 (misal 1.5), berarti ada bias berlebih dalam penilaian yang membuat hasil perhitungan menjadi tidak proporsional (skor akhir bisa melambung tinggi di luar skala normal).

**Ilustrasi Sederhana:**
Bayangkan Anda membagi kue bantuan sosial:

- Potongan untuk faktor Ekonomi: 50% (0.5)
- Potongan untuk faktor Kesehatan: 30% (0.3)
- Potongan untuk faktor Pendidikan: 20% (0.2)
- **Total**: 100% (1.0) -> Kue utuh terbagi habis.

Jika Anda memberi bobot Ekonomi 0.8 dan Kesehatan 0.5, totalnya 1.3. Ini tidak logis secara proporsi karena melebihi kapasitas "kepentingan" yang seharusnya maksimal 100%.

### 💡 Penjelasan Tipe: Benefit vs Cost

- **Benefit (Keuntungan)**: Semakin **besar** nilainya, semakin **layak** dia menerima bantuan.
  - _Contoh_: Jumlah Tanggungan (semakin banyak anak, semakin butuh bantuan), Usia (semakin tua, semakin prioritas).
- **Cost (Biaya/Beban)**: Semakin **kecil** nilainya, semakin **layak** dia menerima bantuan.
  - _Contoh_: Penghasilan (semakin kecil penghasilan, semakin miskin/butuh bantuan).

---

## 3. Data Penerima / Alternatif (`/alternatives`)

Menu ini digunakan untuk memasukkan data warga yang akan dinilai.
Pastikan semua data terisi untuk setiap kriteria agar perhitungan akurat.

---

## 4. Perhitungan VIKOR & Data Teknis (`/calculation`)

Menu ini adalah "otak" dari sistem. Di sini terjadi proses matematika kompleks yang mengubah data mentah menjadi keputusan ranking.

### Tahapan & Matriks Perhitungan (Detail Teknis)

Sistem akan memproses data melalui 5 tahap utama yang ditampilkan dalam bentuk matriks:

#### 1. Matriks Keputusan Asli (Original Data)

Ini adalah data mentah yang Anda input.

- Baris = Nama Calon Penerima (Alternatif).
- Kolom = Kriteria (misal: Penghasilan, Tanggungan).
- Isi = Nilai asli (misal: Rp 1.000.000, 3 anak, dst).

#### 2. Matriks Normalisasi

Data mentah seringkali punya satuan beda (Rupiah vs Orang vs Skor). Normalisasi mengubah semua angka ini menjadi skala seragam (0-1) agar bisa diadu.

- **Rumus**: Menggunakan linear normalization.
- Hasilnya adalah angka desimal murni tanpa satuan.

#### 3. Matriks Ternormalisasi Terbobot (Weighted Matrix)

Nilai normalisasi dikalikan dengan **Bobot** yang Anda atur di menu Kriteria.

- Kriteria penting akan memberikan dampak skor lebih besar di tahap ini.

#### 4. Nilai S dan R (Utility & Regret)

Ini adalah inti metode VIKOR.

- **Nilai S (Group Utility)**: Mengukur "rata-rata kepuasan". Semakin kecil nilai S, semakin mayoritas kriteria terpenuhi dengan baik.
- **Nilai R (Individual Regret)**: Mengukur "penyesalan terburuk". Ini melihat kriteria mana yang nilainya paling jelek pada kandidat tersebut.
- _Filosofi_: Kandidat yang baik tidak hanya bagus secara rata-rata (S), tapi juga tidak punya kelemahan fatal di satu kriteria tertentu (R).

#### 5. Nilai Indeks VIKOR (Q) - Hasil Akhir

Nilai Q adalah gabungan dari S dan R untuk menentukan ranking final.

- **Rumus**: `Q = v * (S - S_min)/(S_max - S_min) + (1-v) * (R - R_min)/(R_max - R_min)`
- **v = 0.5**: Ini adalah nilai konsensus standar (jalan tengah antara rata-rata vs nilai terburuk).

### Cara Membaca Hasil Akhir

Pada tabel **"Hasil Perankingan Akhir"**:

1.  **Ranking 1**: Adalah solusi kompromi terbaik.
2.  **Nilai Q**: Semakin **KECIL** (mendekati 0), semakin **BAIK**.
    - Q = 0.00 artinya kandidat tersebut adalah yang terbaik mutlak berdasarkan data yang ada.
    - Q = 1.00 artinya kandidat tersebut adalah yang terburuk.

**Kesimpulan:**
Pilihlah warga yang berada di **Ranking 1, 2, dst** sebagai prioritas penerima bantuan sosial.
