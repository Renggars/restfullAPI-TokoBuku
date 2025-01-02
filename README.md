# Express.js Project

## Prasyarat
Sebelum memulai, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (termasuk npm)
- [MySQL](https://dev.mysql.com/downloads/installer/) atau MariaDB terinstal dan berjalan.

## Langkah-langkah untuk Menjalankan Proyek

1. **Kloning repositori**

   Kloning repositori ke komputer lokal Anda:
   ```bash
   git clone https://github.com/username/nama-repositori.git
   ```

2. **Masuk ke direktori proyek**

  Pindah ke folder proyek:
```bash
cd nama-repositori
```

3. **Instalasi dependensi**
Instal semua dependensi yang diperlukan menggunakan npm:
   ```bash
npm install
```

4. **Setup file .env**

buat file .env di root
Kemudian, buka file .env dan tambahkan konfigurasi berikut:
   ```bash
DATABASE_URL=isi_url_database_anda
PORT=3000

JWT_SECRET=isi_secret_jwt (bebas)
JWT_ACCESS_EXPIRATION_HOURS=12
JWT_REFRESH_EXPIRATION_DAYS=30
```

5. **Menjalankan Server**
Menjalankan Server
```bash
npm run dev
```

Server akan berjalan pada http://localhost:3000.

**Catatan**
Pastikan konfigurasi database di .env sudah sesuai dengan database yang Anda gunakan.
Anda bisa mengubah nilai JWT_SECRET, JWT_ACCESS_EXPIRATION_HOURS, dan JWT_REFRESH_EXPIRATION_DAYS sesuai dengan kebutuhan keamanan dan waktu kedaluwarsa JWT Anda.
