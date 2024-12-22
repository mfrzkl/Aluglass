const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./connections');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // URL frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode yang diizinkan
}));


// Inventory Endpoints
app.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM inventory');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/', (req, res) => {
    const { kode_produk, nama_produk, kategori, warna, ketebalan, dimensi, stok, harga_satuan } = req.body;
    db.query(
        'INSERT INTO inventory (kode_produk, nama_produk, kategori, warna, ketebalan, dimensi, stok, harga_satuan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [kode_produk, nama_produk, kategori, warna, ketebalan, JSON.stringify(dimensi), stok, harga_satuan],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Inventory item created', id: results.insertId });
        }
    );
});

app.put('/:kode_produk', (req, res) => {
    const { kode_produk } = req.params;
    const { stok } = req.body;

    // Validasi input untuk memastikan hanya 'stok' yang diterima
    if (!Object.keys(req.body).includes('stok') || Object.keys(req.body).length !== 1) {
        return res.status(400).json({ message: 'Hanya kolom stok yang dapat diubah!' });
    }

    if (typeof stok !== 'number' || stok < 0) {
        return res.status(400).json({ message: 'Stok harus berupa angka positif!' });
    }

    db.query(
        'UPDATE inventory SET stok = ? WHERE kode_produk = ?',
        [stok, kode_produk],
        (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Produk tidak ditemukan!' });
            }

            res.json({ message: 'Stok berhasil diperbarui!' });
        }
    );
});

app.delete('/:kode_produk', (req, res) => {
    const { kode_produk } = req.params;
    db.query('DELETE FROM inventory WHERE kode_produk = ?', [kode_produk], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Inventory item deleted' });
    });
});

// Jalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Inventory service running on port ${PORT}`);
});