landing, register, login, ongoing, settings, history, pop up review

1.  Landing
    Halaman Landing merupakan halaman utama dimana
    a. Jika User BELUM LOGIN, maka halaman Landing akan memunculkan Login Form
        Dimana, jika user belum punya account, akan di -redirext ke halaman Register
    b. Jika User SUDAH LOGIN, maka halaman Landing akan memunculkan Order Form

2.  Login
    Berupa form partials berisi email dan password yang digunakan untuk login
3.  Order
    Berupa form partials berisi destination, pickUp, & driver yang digunakan untuk jalan jalan

4.  Register
    Halaman Create New Account, berisikan form data untuk tabel User & Profiles
5.  Setting
    Halaman Edit Account, berisikan form untuk meng-edit data2 di tabel User & Profile

6.  Ongoing
    Halaman tunggu setelah order dibuat, dimana:
    a. Menunjukkan perkiraan waktu tiba (random)
    b. Memiliki tombol "Sudah Sampai" sebagai input jika sudah sampai di tujuan.
    c. Jika tombol "Sudah Sampai" di klik, akan memunculkan form Review untuk memberi bintang, lalu Redirect ke Halaman History

7.  History
    Halaman yang menunjukkan history dari perjalanan
    Memiliki Filter By User dan By Driver

Halaman Create Orders: -> redirect Ongoing Page
promise chaining 
-> Create Order
-> Increment Driver 
-> Increment User

Halaman On the way page: redirect -> Halaman History
-> Send Email Receipt

Halaman History: 
Eager Loading Orders include User, Profiles, & Driver


Driver 
-> Getter/Static/Instance -> Update Role