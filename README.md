# SMP Permata Bangsa — Login Page (Hapi)

Project ini adalah website sederhana menggunakan **Node.js + Hapi** untuk menampilkan halaman **Login Sistem Informasi Sekolah**.

## Prasyarat

- Node.js (disarankan versi LTS)
- npm

## Instalasi

```bash
npm install
```

## Menjalankan Server

Mode development (auto-reload dengan nodemon):

```bash
npm run dev
```

Mode production:

```bash
npm start
```

Server berjalan di:
- `http://localhost:3000`
- Halaman info pendaftaran: `http://localhost:3000/` atau `http://localhost:3000/info-pendaftaran`
- Halaman login: `http://localhost:3000/login`

## Struktur Folder

- `src/server.js` — Hapi server & routes
- `public/login.html` — halaman login
- `public/styles.css` — styling halaman login
- `public/assets/` — logo & gambar (foto gedung, dll)

## Catatan

- Port bisa diubah dengan env `PORT`:

```bash
set PORT=3001
npm start
```
