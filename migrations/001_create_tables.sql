-- Create Database
CREATE DATABASE IF NOT EXISTS aluglass;

USE aluglass;

-- Create inventory table
CREATE TABLE inventory (
    kode_produk VARCHAR(10) NOT NULL UNIQUE PRIMARY KEY,
    nama_produk VARCHAR(255) NOT NULL,
    kategori ENUM('kaca', 'aluminium') NOT NULL,
    warna VARCHAR(50) NOT NULL,
    ketebalan FLOAT NOT NULL,
    panjang1 INT NOT NULL,
    lebar1 INT NOT NULL,
    panjang2 INT,
    lebar2 INT,
    stok INT NOT NULL,
    harga_satuan FLOAT NOT NULL
);

-- Create sales_order table
CREATE TABLE sales_order (
    sales_order_no VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    tanggal_pesanan DATE NOT NULL,
    pelanggan VARCHAR(255) NOT NULL,
    status ENUM('pending', 'paid', 'canceled') DEFAULT 'pending',
    produk JSON NOT NULL,
    qty INT NOT NULL,
    total_harga FLOAT NOT NULL
);

-- Create delivery_orders table
CREATE TABLE delivery_order (
    DO_NO VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    SO_NO VARCHAR(20) NOT NULL,
    tanggal_dikirim DATE NOT NULL,
    penerima VARCHAR(255) NOT NULL,
    alamat VARCHAR(255) NOT NULL,
    catatan VARCHAR(255),
    status ENUM('diproses', 'barang telah keluar', 'canceled') DEFAULT 'diproses',
    FOREIGN KEY (SO_NO) REFERENCES sales_order(sales_order_no)
);

-- Create invoices table
CREATE TABLE invoices (
    invoice_no VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    SO_NO VARCHAR(20) NOT NULL,
    sales_name VARCHAR(255) NOT NULL,
    metode_pembayaran ENUM('cek', 'debit') NOT NULL,
    tanggal_pembayaran DATE,
    status_pembayaran ENUM('lunas', 'outstanding') DEFAULT 'outstanding',
    tanggal_penagihan DATE,
    customer VARCHAR(255) NOT NULL,
    nominal FLOAT NOT NULL,
    produk JSON,
    FOREIGN KEY (SO_NO) REFERENCES sales_order(sales_order_no)
);

-- Create shipments table
CREATE TABLE shipments (
    nomor_pengiriman VARCHAR(20) NOT NULL PRIMARY KEY,
    produk JSON NOT NULL,
    tanggal_pengiriman DATE NOT NULL,
    tanggal_diterima DATE,
    status ENUM('diproses', 'dalam perjalanan', 'selesai') DEFAULT 'diproses'
);

-- Insert 50 sample inventory data
INSERT INTO inventory (kode_produk, nama_produk, kategori, warna, ketebalan, panjang1, lebar1, panjang2, lebar2, stok, harga_satuan)
VALUES
('KACA001', 'Kaca Jendela', 'kaca', 'Transparan', 5.0, 100, 50, NULL, NULL, 50, 200000),
('KACA002', 'Kaca Cermin', 'kaca', 'Silver', 6.0, 120, 60, NULL, NULL, 30, 250000),
('ALU001', 'Pintu Aluminium', 'aluminium', 'Putih', 2.5, 200, 90, 150, 70, 20, 1500000),
('ALU002', 'Panel Aluminium', 'aluminium', 'Hitam', 3.0, 250, 100, NULL, NULL, 40, 1000000),
('KACA003', 'Kaca Tempered', 'kaca', 'Hitam', 8.0, 150, 80, NULL, NULL, 15, 350000),
('ALU003', 'Jendela Aluminium', 'aluminium', 'Perak', 2.0, 180, 70, 130, 60, 25, 1200000),
('KACA004', 'Kaca Bengkok', 'kaca', 'Hijau', 7.0, 110, 50, NULL, NULL, 10, 300000),
('ALU004', 'Pintu Aluminium Double', 'aluminium', 'Coklat', 4.0, 220, 90, 180, 80, 12, 1800000),
('KACA005', 'Kaca Tempered', 'kaca', 'Clear', 10.0, 160, 90, NULL, NULL, 8, 400000),
('ALU005', 'Papan Aluminium', 'aluminium', 'Emas', 1.5, 200, 100, NULL, NULL, 60, 950000);

-- INSERT INTO sales_order (sales_order_no, tanggal_pesanan, pelanggan, status, total_harga, produk)
-- VALUES
-- ('SO001', '2024-12-01', 'PT. ABC', 'pending', 5000000, '[{"kode_produk":"KACA001","jumlah":10},{"kode_produk":"ALU001","jumlah":5}]'),
-- ('SO002', '2024-12-02', 'CV. XYZ', 'paid', 3000000, '[{"kode_produk":"KACA002","jumlah":5}]'),
-- ('SO003', '2024-12-03', 'Toko Maju', 'canceled', 12000000, '[{"kode_produk":"ALU002","jumlah":8},{"kode_produk":"KACA003","jumlah":4}]'),
-- ('SO004', '2024-12-04', 'Toko Jaya', 'pending', 10000000, '[{"kode_produk":"KACA004","jumlah":2},{"kode_produk":"ALU003","jumlah":3}]'),
-- ('SO005', '2024-12-05', 'Perusahaan Kencana', 'paid', 7000000, '[{"kode_produk":"ALU004","jumlah":5}]'),
-- ('SO006', '2024-12-06', 'PT. Gemilang', 'paid', 15000000, '[{"kode_produk":"KACA005","jumlah":3},{"kode_produk":"ALU005","jumlah":6}]'),
-- ('SO007', '2024-12-07', 'Toko Sukses', 'pending', 4000000, '[{"kode_produk":"KACA002","jumlah":7}]'),
-- ('SO008', '2024-12-08', 'PT. Jaya Abadi', 'canceled', 8000000, '[{"kode_produk":"ALU001","jumlah":10}]'),
-- ('SO009', '2024-12-09', 'CV. Sejahtera', 'paid', 5500000, '[{"kode_produk":"KACA003","jumlah":6}]'),
-- ('SO010', '2024-12-10', 'Toko Indah', 'pending', 3500000, '[{"kode_produk":"ALU003","jumlah":4},{"kode_produk":"KACA004","jumlah":2}]');
INSERT INTO sales_order VALUES (
    'SO-2024001',
    '2024-01-15',
    'PT Maju Jaya',
    'pending',
    '[{"kode_produk":"P001","nama_produk":"Besi Hollow","qty":50,"harga_satuan":75000},{"kode_produk":"P002","nama_produk":"Plat Baja","qty":25,"harga_satuan":120000}]',
    75,
    6750000
);

INSERT INTO sales_order VALUES (
    'SO-2024002',
    '2024-01-20',
    'CV Sukses Mandiri',
    'paid',
    '[{"kode_produk":"P003","nama_produk":"Pipa Besi","qty":100,"harga_satuan":45000}]',
    100,
    4500000
);

INSERT INTO sales_order VALUES (
    'SO-2024003',
    '2024-02-01',
    'UD Makmur Sejahtera',
    'canceled',
    '[{"kode_produk":"P001","nama_produk":"Besi Hollow","qty":30,"harga_satuan":75000},{"kode_produk":"P004","nama_produk":"Kawat Las","qty":20,"harga_satuan":85000}]',
    50,
    3950000
);

INSERT INTO sales_order VALUES (
    'SO-2024004',
    '2024-02-15',
    'PT Baja Utama',
    'paid',
    '[{"kode_produk":"P002","nama_produk":"Plat Baja","qty":40,"harga_satuan":120000},{"kode_produk":"P005","nama_produk":"Seng Gelombang","qty":35,"harga_satuan":95000}]',
    75,
    8125000
);

INSERT INTO sales_order VALUES (
    'SO-2024005',
    '2024-02-28',
    'CV Karya Abadi',
    'pending',
    '[{"kode_produk":"P003","nama_produk":"Pipa Besi","qty":60,"harga_satuan":45000},{"kode_produk":"P001","nama_produk":"Besi Hollow","qty":45,"harga_satuan":75000}]',
    105,
    6075000
);

INSERT INTO sales_order VALUES (
    'SO-2024006',
    '2024-03-05',
    'UD Berkah Jaya',
    'paid',
    '[{"kode_produk":"P004","nama_produk":"Kawat Las","qty":75,"harga_satuan":85000}]',
    75,
    6375000
);

INSERT INTO sales_order VALUES (
    'SO-2024007',
    '2024-03-10',
    'PT Logam Indah',
    'pending',
    '[{"kode_produk":"P005","nama_produk":"Seng Gelombang","qty":50,"harga_satuan":95000},{"kode_produk":"P002","nama_produk":"Plat Baja","qty":30,"harga_satuan":120000}]',
    80,
    8350000
);

INSERT INTO sales_order VALUES (
    'SO-2024008',
    '2024-03-15',
    'CV Mitra Usaha',
    'paid',
    '[{"kode_produk":"P001","nama_produk":"Besi Hollow","qty":90,"harga_satuan":75000},{"kode_produk":"P003","nama_produk":"Pipa Besi","qty":55,"harga_satuan":45000}]',
    145,
    9225000
);

INSERT INTO sales_order VALUES (
    'SO-2024009',
    '2024-03-20',
    'PT Baja Sentosa',
    'canceled',
    '[{"kode_produk":"P002","nama_produk":"Plat Baja","qty":25,"harga_satuan":120000},{"kode_produk":"P004","nama_produk":"Kawat Las","qty":40,"harga_satuan":85000}]',
    65,
    6400000
);

INSERT INTO sales_order VALUES (
    'SO-2024010',
    '2024-03-25',
    'UD Sejahtera Abadi',
    'pending',
    '[{"kode_produk":"P005","nama_produk":"Seng Gelombang","qty":70,"harga_satuan":95000},{"kode_produk":"P001","nama_produk":"Besi Hollow","qty":35,"harga_satuan":75000}]',
    105,
    9275000
);

INSERT INTO invoices (invoice_no, SO_NO, sales_name, metode_pembayaran, tanggal_pembayaran, status_pembayaran, tanggal_penagihan, customer, nominal, produk)
VALUES
('INV001', 'SO001', 'Eko Prasetyo', 'debit', '2024-12-05', 'lunas', '2024-12-01', 'PT. ABC', 5000000, '[{"kode_produk":"KACA001","jumlah":10},{"kode_produk":"ALU001","jumlah":5}]'),
('INV002', 'SO002', 'Lina Oktavia', 'cek', '2024-12-06', 'lunas', '2024-12-02', 'CV. XYZ', 3000000, '[{"kode_produk":"KACA002","jumlah":5}]'),
('INV003', 'SO003', 'Faisal Rachman', 'debit', NULL, 'outstanding', '2024-12-03', 'Toko Maju', 12000000, '[{"kode_produk":"ALU002","jumlah":8},{"kode_produk":"KACA003","jumlah":4}]'),
('INV004', 'SO004', 'Rizky Maulana', 'debit', '2024-12-06', 'lunas', '2024-12-04', 'Toko Jaya', 10000000, '[{"kode_produk":"KACA004","jumlah":2},{"kode_produk":"ALU003","jumlah":3}]'),
('INV005', 'SO005', 'Dian Putri', 'cek', '2024-12-07', 'lunas', '2024-12-05', 'Perusahaan Kencana', 7000000, '[{"kode_produk":"ALU004","jumlah":5}]'),
('INV006', 'SO006', 'Asep Hidayat', 'debit', '2024-12-08', 'lunas', '2024-12-06', 'PT. Gemilang', 15000000, '[{"kode_produk":"KACA005","jumlah":3},{"kode_produk":"ALU005","jumlah":6}]'),
('INV007', 'SO007', 'Maya Sari', 'cek', NULL, 'outstanding', '2024-12-07', 'Toko Sukses', 4000000, '[{"kode_produk":"KACA002","jumlah":7}]'),
('INV008', 'SO008', 'Agus Priyanto', 'debit', '2024-12-09', 'lunas', '2024-12-08', 'PT. Jaya Abadi', 8000000, '[{"kode_produk":"ALU001","jumlah":10}]'),
('INV009', 'SO009', 'Wulan Pertiwi', 'cek', NULL, 'outstanding', '2024-12-09', 'CV. Sejahtera', 5500000, '[{"kode_produk":"KACA003","jumlah":6}]'),
('INV010', 'SO010', 'Rudi Setiawan', 'debit', '2024-12-10', 'lunas', '2024-12-10', 'Toko Indah', 3500000, '[{"kode_produk":"ALU003","jumlah":4},{"kode_produk":"KACA004","jumlah":2}]');

INSERT INTO delivery_order (DO_NO, SO_NO, tanggal_dikirim, penerima, alamat, catatan, status)
VALUES
('DO001', 'SO001', '2024-12-02', 'John Doe', 'Jl. Raya No. 12, Jakarta', 'Segera dikirim', 'diproses'),
('DO002', 'SO002', '2024-12-03', 'Jane Smith', 'Jl. Merdeka No. 5, Surabaya', NULL, 'barang telah keluar'),
('DO003', 'SO003', '2024-12-04', 'Ahmad Yani', 'Jl. Sudirman No. 10, Bandung', 'Dibatalkan', 'canceled'),
('DO004', 'SO004', '2024-12-06', 'Budi Santoso', 'Jl. Semangka No. 4, Yogyakarta', NULL, 'diproses'),
('DO005', 'SO005', '2024-12-07', 'Chandra Wijaya', 'Jl. Kuningan No. 7, Medan', NULL, 'barang telah keluar'),
('DO006', 'SO006', '2024-12-08', 'Dewi Lestari', 'Jl. Melati No. 8, Makassar', 'Segera dikirim', 'diproses'),
('DO007', 'SO007', '2024-12-09', 'Rina Rahayu', 'Jl. Anggrek No. 3, Bali', NULL, 'diproses'),
('DO008', 'SO008', '2024-12-10', 'Tomi Setiawan', 'Jl. Mangga No. 6, Bogor', NULL, 'barang telah keluar'),
('DO009', 'SO009', '2024-12-11', 'Lina Puspita', 'Jl. Cempaka No. 2, Palembang', 'Dibatalkan', 'canceled'),
('DO010', 'SO010', '2024-12-12', 'Andi Wibowo', 'Jl. Kenanga No. 11, Semarang', NULL, 'diproses');

INSERT INTO shipments (nomor_pengiriman, produk, tanggal_pengiriman, tanggal_diterima, status)
VALUES
('SP001', '[{"kode_produk":"KACA001","jumlah":10},{"kode_produk":"ALU001","jumlah":5}]', '2024-12-05', '2024-12-06', 'selesai'),
('SP002', '[{"kode_produk":"KACA002","jumlah":5}]', '2024-12-06', '2024-12-07', 'selesai'),
('SP003', '[{"kode_produk":"ALU002","jumlah":8},{"kode_produk":"KACA003","jumlah":4}]', '2024-12-07', NULL, 'dalam perjalanan'),
('SP004', '[{"kode_produk":"KACA004","jumlah":2},{"kode_produk":"ALU003","jumlah":3}]', '2024-12-08', '2024-12-09', 'selesai'),
('SP005', '[{"kode_produk":"ALU004","jumlah":5}]', '2024-12-09', NULL, 'dalam perjalanan'),
('SP006', '[{"kode_produk":"KACA005","jumlah":3},{"kode_produk":"ALU005","jumlah":6}]', '2024-12-10', NULL, 'diproses'),
('SP007', '[{"kode_produk":"KACA002","jumlah":7}]', '2024-12-10', '2024-12-11', 'selesai'),
('SP008', '[{"kode_produk":"ALU001","jumlah":10}]', '2024-12-12', NULL, 'dalam perjalanan'),
('SP009', '[{"kode_produk":"KACA003","jumlah":6}]', '2024-12-13', NULL, 'diproses'),
('SP010', '[{"kode_produk":"ALU003","jumlah":4},{"kode_produk":"KACA004","jumlah":2}]', '2024-12-14', NULL, 'diproses');