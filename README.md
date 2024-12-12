# Aluglass
Aplikasi ini dirancang untuk mendukung proses pengelolaan pesanan (Sales Order), pengiriman (Delivery Order), pengelolaan stok barang (Inventory), dan pemantauan pengiriman barang (Shipments) untuk produk kaca dan aluminium.

Alur tabel dan hubungan antar entitas dalam aplikasi:

# Sales Order (SO)
Digunakan untuk mencatat pesanan pelanggan.
Tabel ini mencatat nomor pesanan, tanggal pesanan, pelanggan, detail produk yang dipesan (termasuk jumlah, warna, ketebalan, dimensi, dan harga), serta total harga pesanan.
Sales Order dapat dibuat dan dikelola oleh pengguna dengan peran Sales Accounting.

# Delivery Order (DO)
Setelah pesanan dibuat, Delivery Order dibuat berdasarkan informasi dari Sales Order.
Tabel ini mencatat nomor pengiriman, tanggal pengiriman, ID Sales Order terkait, serta status pengiriman (e.g., pending, in transit, atau delivered).
Delivery Order dikelola oleh pengguna dengan peran Operasional.

# Inventory
Menyimpan informasi stok produk kaca dan aluminium, termasuk detail seperti warna, ketebalan, dimensi, jumlah, dan harga satuan.
Pengguna dengan peran Staff Gudang memiliki akses penuh untuk melakukan operasi CRUD pada tabel ini.

#Shipments
Digunakan untuk memantau status pengiriman barang yang terhubung dengan Delivery Order dan Sales Order.
Tabel ini mencatat nomor pengiriman, ID Sales Order, ID Delivery Order, detail barang yang dikirim, tanggal pengiriman, tanggal diterima, dan status pengiriman.
Shipments dikelola oleh pengguna dengan peran Operasional.
User Management

ROLE:
1. Admin: Mengelola seluruh tabel dan aplikasi.
2. Staff Gudang: Mengelola tabel Inventory.
3. Operasional: Mengelola tabel Delivery Order dan Shipments.
4. Sales Accounting: Membuat dan mengelola tabel Sales Order.
5. Customer: Dapat melihat status pengiriman pesanan mereka dan melihat katalog.
   
# Alur Proses
-> Customer melihat katalog barang
-> Sales Accounting mencatat pesanan pelanggan dalam Sales Order.
-> Operasional membuat Delivery Order berdasarkan Sales Order yang ada.
-> Staff Gudang memastikan stok barang di Inventory tersedia dan mencatat perubahan stok.
-> Operasional memantau dan memperbarui status pengiriman dalam tabel Shipments hingga barang diterima pelanggan.
-> Customer dapat melihat status pengiriman pesanan mereka
