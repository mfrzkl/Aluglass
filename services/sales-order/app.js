const express = require('express');
const app = express();
const db = require('../../db/connections');
app.use(express.json());
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // URL frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode yang diizinkan
}));

app.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM sales_order');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/', (req, res) => {
    const { sales_order_no, tanggal_pesanan, pelanggan, status, produk, qty, total_harga } = req.body;
    db.query(
        'INSERT INTO sales_order (sales_order_no, tanggal_pesanan, pelanggan, status, produk, qty, total_harga) VALUES (?, ?, ?, ?, ?, ?)',
        [sales_order_no, tanggal_pesanan, pelanggan, status, JSON.stringify(produk), qty, total_harga],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Sales Order dibuat', id: results.insertId });
        }
    );
});

app.put('/:sales_order_no', (req, res) => {
    const { sales_order_no } = req.params;
    const { status } = req.body;

    // Validasi input untuk memastikan hanya 'status' yang diterima
    if (!Object.keys(req.body).includes('status') || Object.keys(req.body).length !== 1) {
        return res.status(400).json({ message: 'Hanya kolom status yang dapat diubah!' });
    }

    // Validasi nilai status (opsional, jika ada batasan nilai untuk status)
    if (typeof status !== 'string' || status.trim() === '') {
        return res.status(400).json({ message: 'Status harus berupa string yang valid!' });
    }

    db.query(
        'UPDATE sales_order SET status = ? WHERE sales_order_no = ?',
        [status, sales_order_no],
        (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Sales Order tidak ditemukan!' });
            }

            res.json({ message: 'Status berhasil diperbarui', affectedRows: results.affectedRows });
        }
    );
});

app.delete('/:sales_order_no', (req, res) => {
    const { sales_order_no } = req.params;
    db.query('DELETE FROM sales_order WHERE sales_order_no = ?', [sales_order_no], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Sales Order tidak ditemukan!' });
        }

        res.json({ message: 'Sales Order dihapus!' });
    });
});

// Jalankan server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`SO service running on port ${PORT}`);
});
