# V-Track: Tech Stack & Architecture Overview

Dokumen ini menjelaskan teknologi yang digunakan di balik layar V-Track, bagaimana masing-masing komponen bekerja, serta rangkuman singkat yang bisa digunakan untuk keperluan portofolio atau CV.

## 1. Fondasi Utama: Next.js 15 (React)
- **Fungsi:** Bertindak sebagai *framework* gabungan. Biasanya dalam pengembangan web terdapat pemisahan antara "Front-End" (tampilan visual) dan "Back-End" (server). Next.js mampu menangani **keduanya sekaligus** dalam satu tempat. 
- **Arsitektur:** V-Track menggunakan arsitektur terbaru yaitu **App Router** (folder `app/`), yang membuat aplikasi menjadi sangat cepat karena banyak proses *render* halaman dilakukan di server sebelum dikirim ke browser pengguna (*Server Side Rendering*).

## 2. Tampilan (Styling): Tailwind CSS v4
- **Fungsi:** Menggantikan cara penulisan CSS tradisional yang panjang. Tailwind memungkinkan pemberian gaya (*styling*) langsung di dalam kode HTML/React melalui *utility classes* seperti `flex`, `bg-primary`, `rounded-xl`, dan lain-lain.
- **Kelebihan:** Mempercepat proses desain sehingga tampilan V-Track bisa terlihat sangat modern, responsif di berbagai layar, dan mengusung tema gelap (*dark-theme*) dengan sangat mudah.

## 3. Database & Penyimpanan: Supabase (PostgreSQL)
- **Fungsi:** Supabase adalah platform *Backend-as-a-Service* (BaaS) berbasis open-source yang sering disebut sebagai alternatif Firebase. Di balik layar, Supabase menggunakan database relasional tingkat perusahaan yang sangat kuat bernama **PostgreSQL**.
- **Peran:** Semua data penting seperti profil pengguna, *history* latihan, dan katalog nama latihan disimpan dengan aman di server *cloud* Supabase. Pengelolaan data secara manual juga dapat dilakukan langsung melalui *dashboard* Supabase (Table Editor).

## 4. Jembatan ke Database: Prisma (ORM)
- **Fungsi:** Prisma bertindak sebagai ORM (*Object-Relational Mapping*), yaitu alat penerjemah antara kode aplikasi dengan database. Daripada menulis kode SQL mentah yang rawan kesalahan (seperti `SELECT * FROM users WHERE...`), Prisma memungkinkan kita menulisnya menggunakan bahasa JavaScript/TypeScript biasa seperti `prisma.user.findMany()`.
- **Peran:** Prisma memastikan kode aplikasi (*backend* Next.js) selalu tersinkronisasi dengan struktur database (*schema*), sehingga sangat meminimalisir *error* atau salah ketik (*type-safety*).

## 5. Sistem Keamanan & Autentikasi: Auth.js (NextAuth v5)
- **Fungsi:** Merupakan pustaka keamanan yang mengurus sistem *Sign Up*, *Sign In*, dan enkripsi *password* (menggunakan `bcrypt`).
- **Peran:** Memastikan bahwa halaman-halaman sensitif (seperti *Dashboard* dan riwayat latihan) terlindungi dan hanya bisa diakses oleh pengguna yang sudah login, termasuk menyediakan fungsionalitas sesi sementara melalui fitur *Guest Mode*.

## 6. Memori Pintar Aplikasi: Zustand
- **Fungsi:** Digunakan sebagai *State Management* (pengelola kondisi/data sementara) di sisi klien (browser).
- **Peran:** Saat pengguna sedang berada di halaman *Active Workout*, ada data yang terus berjalan seperti *timer*, berat beban, dan jumlah *reps* yang sedang diketik. Jika pengguna berpindah halaman secara tidak sengaja, data ini tidak akan hilang karena Zustand menyimpannya secara efisien di memori browser.

---

## 💼 Rangkuman Untuk Portofolio / CV

*Silakan salin teks di bawah ini ke dalam portofolio, CV, atau profil LinkedIn kamu:*

**V-Track (High-Performance Workout Tracker)**
A modern, full-stack web application designed for athletes to track workout sessions, sets, and progress in real-time.

**Tech Stack:**
- **Core Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** Auth.js (NextAuth v5)
- **State Management:** Zustand
- **Deployment:** Vercel

**Key Features:**
- *Real-time active workout tracking* dengan kemampuan menyimpan *state* sementara (Zustand).
- Sistem autentikasi yang aman dilengkapi dengan fungsionalitas *Guest Mode* (Auth.js).
- Desain UI/UX yang modern, responsif, dan bertema gelap (Tailwind).
- Skema *database* relasional yang efisien untuk melacak riwayat latihan dan profil pengguna (Prisma & PostgreSQL).
