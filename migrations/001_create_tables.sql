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
    dimensi VARCHAR(255) NOT NULL,
    stok INT NOT NULL,
    harga_satuan FLOAT NOT NULL,
);

-- Create sales_order table
CREATE TABLE sales_order (
    sales_order_no VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    tanggal_pesanan DATE NOT NULL,
    pelanggan VARCHAR(255) NOT NULL,
    status ENUM('pending', 'paid', 'canceled') DEFAULT 'pending',
    total_harga FLOAT NOT NULL,
    produk JSON NOT NULL
);

-- Create delivery_orders table
CREATE TABLE delivery_orders (
    DO_NO VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    SO_NO VARCHAR(20) NOT NULL,
    tanggal_pengiriman DATE NOT NULL,
    status ENUM('dikemas', 'dalam perjalanan', 'selesai') DEFAULT 'dikemas',
    FOREIGN KEY (SO_NO) REFERENCES sales_order(sales_order_no)
);

-- Create invoices table
CREATE TABLE invoices (
    invoice_no VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    sales_name VARCHAR(255) NOT NULL,
    metode_pembayaran VARCHAR(50) NOT NULL,
    tanggal_pembayaran DATE,
    status_pembayaran ENUM('dp', 'dibayar lunas', 'outstanding') DEFAULT 'outstanding',
    tanggal_penagihan DATE,
    customer VARCHAR(255) NOT NULL,
    nominal FLOAT NOT NULL,
    produk JSON NOT NULL
);

-- Create shipments table
CREATE TABLE shipments (
    nomor_pengiriman VARCHAR(20) NOT NULL PRIMARY KEY,
    SO VARCHAR(20) NOT NULL,
    DO VARCHAR(20) NOT NULL,
    produk JSON NOT NULL,
    tanggal_pengiriman DATE NOT NULL,
    tanggal_diterima DATE,
    status ENUM('dikemas', 'dalam perjalanan', 'selesai') DEFAULT 'dikemas'
);

-- Insert 10 sample inventory data
-- Insert 50 sample inventory data
INSERT INTO inventory (kode_produk, nama_produk, kategori, warna, ketebalan, stok, harga_satuan, dimensi) VALUES
('KP001', 'Kaca Tempered', 'kaca', 'Bening', 10, 100, 250000, '100x200'),
('KP002', 'Kaca Laminated', 'kaca', 'Hijau', 12, 50, 300000, '150x250'),
('KP003', 'Kaca Buram', 'kaca', 'Putih Susu', 8, 75, 200000, '120x240'),
('PA001', 'Profil Aluminium U-Shape', 'aluminium', 'Silver', 3, 150, 50000, '40x2000'),
('PA002', 'Frame Aluminium', 'aluminium', 'Hitam', 4, 120, 75000, '50x2500'),
('PA003', 'Profil Aluminium L-Shape', 'aluminium', 'Silver', 2, 200, 60000, '30x3000'),
('KP004', 'Kaca Polos', 'kaca', 'Bening', 6, 200, 150000, '100x150'),
('KP005', 'Kaca Dekoratif', 'kaca', 'Coklat', 10, 50, 275000, '120x200'),
('PA004', 'Profil Aluminium C-Shape', 'aluminium', 'Silver', 5, 80, 85000, '50x2500'),
('PA005', 'Profil Aluminium Corner', 'aluminium', 'Hitam', 6, 100, 95000, '60x3000'),
-- Additional data samples
('KP006', 'Kaca Es', 'kaca', 'Frosted', 5, 120, 180000, '90x180'),
('KP007', 'Kaca Reflektif', 'kaca', 'Biru', 12, 60, 320000, '150x300'),
('KP008', 'Kaca Warna', 'kaca', 'Merah', 8, 80, 250000, '100x200'),
('PA006', 'Profil Aluminium T-Shape', 'aluminium', 'Silver', 4, 130, 70000, '60x2500'),
('PA007', 'Profil Aluminium Flat', 'aluminium', 'Hitam', 3, 160, 65000, '50x2000'),
('KP009', 'Kaca Anti Peluru', 'kaca', 'Transparan', 20, 25, 5000000, '200x300'),
('KP010', 'Kaca Anti Panas', 'kaca', 'Abu-abu', 10, 40, 350000, '150x200'),
('PA008', 'Profil Aluminium R-Shape', 'aluminium', 'Silver', 5, 90, 85000, '60x3000'),
('PA009', 'Profil Aluminium Hollow', 'aluminium', 'Hitam', 6, 110, 100000, '70x2500'),
('KP011', 'Kaca Tekstur', 'kaca', 'Bening', 6, 140, 230000, '120x180'),
('KP012', 'Kaca Kristal', 'kaca', 'Biru Muda', 8, 50, 400000, '100x150'),
('PA010', 'Profil Aluminium I-Shape', 'aluminium', 'Silver', 3, 100, 55000, '50x2000'),
('KP013', 'Kaca Double Glazed', 'kaca', 'Hijau', 16, 30, 600000, '200x250'),
('KP014', 'Kaca Solar Control', 'kaca', 'Hitam', 10, 40, 450000, '150x200'),
('KP015', 'Kaca Low-E', 'kaca', 'Bening', 12, 35, 500000, '180x300'),
('PA011', 'Profil Aluminium Angled', 'aluminium', 'Silver', 4, 120, 70000, '60x2500'),
('PA012', 'Profil Aluminium Grid', 'aluminium', 'Hitam', 5, 80, 90000, '80x3000'),
('KP016', 'Kaca Acoustic', 'kaca', 'Putih', 14, 40, 480000, '150x300'),
('KP017', 'Kaca Mirrored', 'kaca', 'Silver', 10, 50, 350000, '120x200'),
('PA013', 'Profil Aluminium Curved', 'aluminium', 'Silver', 6, 70, 95000, '70x3000'),
('PA014', 'Profil Aluminium Seamless', 'aluminium', 'Hitam', 4, 95, 80000, '50x2000'),
('KP018', 'Kaca UV Blocking', 'kaca', 'Transparan', 15, 20, 550000, '180x250'),
('KP019', 'Kaca Heat Strengthened', 'kaca', 'Hijau', 12, 45, 400000, '150x200'),
('KP020', 'Kaca Switchable', 'kaca', 'Bening', 18, 10, 800000, '200x300'),
('PA015', 'Profil Aluminium Modular', 'aluminium', 'Silver', 5, 60, 85000, '60x3000'),
('PA016', 'Profil Aluminium Light', 'aluminium', 'Hitam', 3, 100, 60000, '40x2500'),
('KP021', 'Kaca Safety', 'kaca', 'Coklat', 8, 80, 220000, '120x150'),
('KP022', 'Kaca Float', 'kaca', 'Abu-abu', 6, 100, 200000, '100x180'),
('PA017', 'Profil Aluminium Heavy', 'aluminium', 'Silver', 7, 50, 100000, '70x3000'),
('KP023', 'Kaca Pyrolytic', 'kaca', 'Merah', 10, 30, 350000, '150x200'),
('KP024', 'Kaca Frosted Warna', 'kaca', 'Hijau', 8, 70, 270000, '120x180'),
('PA018', 'Profil Aluminium Decorative', 'aluminium', 'Silver', 6, 90, 95000, '60x2500'),
('PA019', 'Profil Aluminium Stamped', 'aluminium', 'Hitam', 4, 85, 75000, '50x2000'),
('KP025', 'Kaca Wire Mesh', 'kaca', 'Putih', 8, 40, 300000, '100x150'),
('KP026', 'Kaca Patterned', 'kaca', 'Kuning', 5, 110, 250000, '120x200');

-- Insert 10 sample sales orders
INSERT INTO sales_order (sales_order_no, tanggal_pesanan, pelanggan, status, total_harga, produk) VALUES
('SO/FR-303/1/01012024', '2024-01-01', 'PT. Kaca Sejahtera', 'pending', 15000000, '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 10, "dimensi": "200x150 cm", "jumlah": 10}]'),
('SO/FR-303/2/01012024', '2024-01-02', 'CV. AluminiTech', 'paid', 5000000, '[{"nama_produk": "Profil Aluminium U-Shape", "warna": "Silver", "ketebalan": 3, "dimensi": "40x2000 mm", "jumlah": 30}]'),
('SO/EL-183/1/02012024', '2024-01-02', 'PT. Kaca Mandiri', 'pending', 12000000, '[{"nama_produk": "Kaca Laminated", "warna": "Hijau", "ketebalan": 12, "dimensi": "150x250 cm", "jumlah": 15}]'),
('SO/EL-183/2/02012024', '2024-01-03', 'CV. GlassWorld', 'paid', 20000000, '[{"nama_produk": "Kaca Buram", "warna": "Putih Susu", "ketebalan": 8, "dimensi": "120x240 cm", "jumlah": 25}]'),
('SO/FR-303/3/03012024', '2024-01-03', 'PT. AluKaca', 'paid', 10000000, '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 6, "dimensi": "150x100 cm", "jumlah": 20}]'),
('SO/FR-303/4/03012024', '2024-01-04', 'CV. AluminiTech', 'pending', 8000000, '[{"nama_produk": "Frame Aluminium", "warna": "Hitam", "ketebalan": 4, "dimensi": "50x2500 mm", "jumlah": 20}]'),
('SO/EL-183/3/04012024', '2024-01-04', 'PT. Kaca Indah', 'paid', 9500000, '[{"nama_produk": "Kaca Polos", "warna": "Bening", "ketebalan": 6, "dimensi": "100x150 cm", "jumlah": 10}]'),
('SO/EL-183/4/04012024', '2024-01-05', 'CV. GlassTech', 'paid', 7500000, '[{"nama_produk": "Kaca Laminated", "warna": "Coklat", "ketebalan": 8, "dimensi": "120x200 cm", "jumlah": 12}]'),
('SO/FR-303/5/05012024', '2024-01-05', 'PT. Kaca Raya', 'pending', 18000000, '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 8, "dimensi": "200x150 cm", "jumlah": 15}]'),
('SO/FR-303/6/05012024', '2024-01-06', 'CV. AluminiWorld', 'paid', 13000000, '[{"nama_produk": "Profil Aluminium L-Shape", "warna": "Silver", "ketebalan": 2, "dimensi": "30x3000 mm", "jumlah": 40}]');

-- Insert 10 sample delivery orders (DO_NO references SO_NO)
INSERT INTO delivery_orders (DO_NO, SO_NO, tanggal_pengiriman, status) VALUES
('DO/1/01012024', 'SO/FR-303/1/01012024', '2024-01-05', 'dalam perjalanan'),
('DO/2/01012024', 'SO/FR-303/2/01012024', '2024-01-06', 'dikemas'),
('DO/3/02012024', 'SO/EL-183/1/02012024', '2024-01-07', 'selesai'),
('DO/4/02012024', 'SO/EL-183/2/02012024', '2024-01-08', 'dalam perjalanan'),
('DO/5/03012024', 'SO/FR-303/3/03012024', '2024-01-09', 'selesai'),
('DO/6/03012024', 'SO/FR-303/4/03012024', '2024-01-10', 'dikemas'),
('DO/7/04012024', 'SO/EL-183/3/04012024', '2024-01-11', 'selesai'),
('DO/8/04012024', 'SO/EL-183/4/04012024', '2024-01-12', 'dalam perjalanan'),
('DO/9/05012024', 'SO/FR-303/5/05012024', '2024-01-13', 'dikemas'),
('DO/10/05012024', 'SO/FR-303/6/05012024', '2024-01-14', 'selesai');

-- Insert 10 sample shipments (Nomor_pengiriman references SO and DO)
INSERT INTO shipments (nomor_pengiriman, SO, DO, produk, tanggal_pengiriman, tanggal_diterima, status) VALUES
('000101202401', 'SO/FR-303/1/01012024', 'DO/1/01012024', '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 10, "dimensi": "200x150 cm", "jumlah": 10}]', '2024-01-05', NULL, 'dalam perjalanan'),
('000102202402', 'SO/FR-303/2/01012024', 'DO/2/01012024', '[{"nama_produk": "Profil Aluminium U-Shape", "warna": "Silver", "ketebalan": 3, "dimensi": "40x2000 mm", "jumlah": 30}]', '2024-01-06', NULL, 'dikemas'),
('000201202403', 'SO/EL-183/1/02012024', 'DO/3/02012024', '[{"nama_produk": "Kaca Laminated", "warna": "Hijau", "ketebalan": 12, "dimensi": "150x250 cm", "jumlah": 15}]', '2024-01-07', '2024-01-08', 'selesai'),
('000202202404', 'SO/EL-183/2/02012024', 'DO/4/02012024', '[{"nama_produk": "Kaca Buram", "warna": "Putih Susu", "ketebalan": 8, "dimensi": "120x240 cm", "jumlah": 25}]', '2024-01-08', NULL, 'dalam perjalanan'),
('000301202405', 'SO/FR-303/3/03012024', 'DO/5/03012024', '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 6, "dimensi": "150x100 cm", "jumlah": 20}]', '2024-01-09', '2024-01-10', 'selesai'),
('000302202406', 'SO/FR-303/4/03012024', 'DO/6/03012024', '[{"nama_produk": "Frame Aluminium", "warna": "Hitam", "ketebalan": 4, "dimensi": "50x2500 mm", "jumlah": 20}]', '2024-01-10', NULL, 'dikemas'),
('000401202407', 'SO/EL-183/3/04012024', 'DO/7/04012024', '[{"nama_produk": "Kaca Polos", "warna": "Bening", "ketebalan": 6, "dimensi": "100x150 cm", "jumlah": 10}]', '2024-01-11', '2024-01-12', 'selesai'),
('000402202408', 'SO/EL-183/4/04012024', 'DO/8/04012024', '[{"nama_produk": "Kaca Laminated", "warna": "Coklat", "ketebalan": 8, "dimensi": "120x200 cm", "jumlah": 12}]', '2024-01-12', NULL, 'dalam perjalanan'),
('000501202409', 'SO/FR-303/5/05012024', 'DO/9/05012024', '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 8, "dimensi": "200x150 cm", "jumlah": 15}]', '2024-01-13', NULL, 'dikemas'),
('000502202410', 'SO/FR-303/6/05012024', 'DO/10/05012024', '[{"nama_produk": "Profil Aluminium L-Shape", "warna": "Silver", "ketebalan": 2, "dimensi": "30x3000 mm", "jumlah": 40}]', '2024-01-14', '2024-01-15', 'selesai');

-- Insert 10 sample invoices (Invoice No references Sales Order)
INSERT INTO invoices (invoice_no, sales_name, metode_pembayaran, tanggal_pembayaran, status_pembayaran, tanggal_penagihan, customer, nominal, produk) VALUES
('INV-0001', 'Francisca', 'Transfer', '2024-01-05', 'dibayar lunas', '2024-01-01', 'PT. Kaca Sejahtera', 15000000, '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 10, "dimensi": "200x150 cm", "jumlah": 10}]'),
('INV-0002', 'Francisca', 'Cash', '2024-01-06', 'dibayar lunas', '2024-01-02', 'CV. AluminiTech', 5000000, '[{"nama_produk": "Profil Aluminium U-Shape", "warna": "Silver", "ketebalan": 3, "dimensi": "40x2000 mm", "jumlah": 30}]'),
('INV-0003', 'Elvira', 'Transfer', '2024-01-08', 'dibayar lunas', '2024-01-02', 'PT. Kaca Mandiri', 12000000, '[{"nama_produk": "Kaca Laminated", "warna": "Hijau", "ketebalan": 12, "dimensi": "150x250 cm", "jumlah": 15}]'),
('INV-0004', 'Elvira', 'Cash', '2024-01-09', 'dibayar lunas', '2024-01-03', 'CV. GlassWorld', 20000000, '[{"nama_produk": "Kaca Buram", "warna": "Putih Susu", "ketebalan": 8, "dimensi": "120x240 cm", "jumlah": 25}]'),
('INV-0005', 'Francisca', 'Transfer', '2024-01-10', 'dibayar lunas', '2024-01-03', 'PT. AluKaca', 10000000, '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 6, "dimensi": "150x100 cm", "jumlah": 20}]'),
('INV-0006', 'Francisca', 'Cash', '2024-01-11', 'dibayar lunas', '2024-01-04', 'CV. AluminiTech', 8000000, '[{"nama_produk": "Frame Aluminium", "warna": "Hitam", "ketebalan": 4, "dimensi": "50x2500 mm", "jumlah": 20}]'),
('INV-0007', 'Elvira', 'Transfer', '2024-01-12', 'dibayar lunas', '2024-01-04', 'PT. Kaca Indah', 9500000, '[{"nama_produk": "Kaca Polos", "warna": "Bening", "ketebalan": 6, "dimensi": "100x150 cm", "jumlah": 10}]'),
('INV-0008', 'Elvira', 'Cash', '2024-01-13', 'dibayar lunas', '2024-01-05', 'CV. GlassTech', 7500000, '[{"nama_produk": "Kaca Laminated", "warna": "Coklat", "ketebalan": 8, "dimensi": "120x200 cm", "jumlah": 12}]'),
('INV-0009', 'Francisca', 'Transfer', '2024-01-14', 'dibayar lunas', '2024-01-06', 'PT. Kaca Raya', 18000000, '[{"nama_produk": "Kaca Tempered", "warna": "Bening", "ketebalan": 8, "dimensi": "200x150 cm", "jumlah": 15}]'),
('INV-0010', 'Francisca', 'Cash', '2024-01-15', 'dibayar lunas', '2024-01-07', 'CV. AluminiWorld', 13000000, '[{"nama_produk": "Profil Aluminium L-Shape", "warna": "Silver", "ketebalan": 2, "dimensi": "30x3000 mm", "jumlah": 40}]');