Nama: Akbar Al Fattah
NIM: 13522036

## Cara menjalankan aplikasi (docker)
1. Isi kredensial dari file .env yang disediakan 
2. Jalankan docker compose
```bash
# Environment development
$ docker-compose -f docker-compose.dev.yml up

# Environment production
$ docker-compose -f docker-compose.prod.yml up
```
3. Karena aplikasi ini tidak dideploy, unduh ngrok terlebih dahulu di https://ngrok.com/ jika ingin menggunakan REST API
4. Tambahkan config.headers['ngrok-skip-browser-warning'] = 'true' agar 
4. Buka ngrok.exe yang sudah diunduh dan ketik ```ngrok http <nomor port yang dikeluarkan oleh console>``` lalu tekan enter
5. ngrok akan memberikan tautan. tautan itulah yang akan dimasukkan ke FE Admin sebagai endpoint
## Kredensial Akun Default
Terdapat 20 akun default hasil seeding saat program ini baru mulai dijalankan, 10 akun admin dan 10 akun user reguler.
Berikut adalah kredensial akun seeding default untuk kebutuhan testing.
<br>a. Kredensial akun admin<br>
```bash
username: admin(angka 0 sampai 9 disambung tanpa spasi)
password(sama semua untuk akun admin default): admin123
email: admin(angka 0 sampai 9 disambung tanpa spasi)@admin.com
 ```
<br>b. Kredensial akun reguler
```bash
username: dummy(angka 0 sampai 9 disambung tanpa spasi)
password(sama semua untuk akun dummy default): dummy123
email: dummy(angka 0 sampai 9 disambung tanpa spasi)@dummy.com
 ```
## Design Pattern yang Digunakan
1. Factory Method (implementasi sendiri)
    <br>Factory method digunakan untuk melakukan seeding user. Alasannya adalah untuk memperingkas seeding user denganrole yang sama
2. Decorator (bawaan dari nestjs)
    <br>Decorator di proyek ini digunakan untuk memberikan kegunaan dari suatu kelas ataupun method
3. Strategy (bawaan dari nestjs)
    <br> Strategy digunakan untuk menjaga route agar tidak bisa diakses secara sembarangan baik menggunakan JWT Token maupun role dari user.
4. Builder (implementasi sendiri)
    <br>Builder digunakan untuk membuat instance film dengan atribut yang nullable

## Bonus yang dikerjakan:
B06 - Responsive layout
<br>B08 - SOLID
<br>B11 - Ember
