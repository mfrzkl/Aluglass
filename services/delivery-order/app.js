const express = require('express')
const app = express();
const db = require('../../db/connections');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // URL frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode yang diizinkan
}));

app.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM delivery_order');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/', (req, res) => {
    const { DO_NO, SO_NO, tanggal_pengiriman, status } = req.body;
    db.query(
        'INSERT INTO delivery_order (DO_NO, SO_NO, tanggal_pengiriman, status) VALUES (?, ?, ?, ?)',
        [DO_NO, SO_NO, tanggal_pengiriman, status],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Delivery Order dibuat', id: results.insertId });
        }
    );
});

app.put('/:DO_NO', (req, res) => {
    const { DO_NO } = req.params;
    const { SO_NO, tanggal_pengiriman, status } = req.body;
    db.query(
        'UPDATE delivery_order SET SO_NO = ?, tanggal_pengiriman = ?, status = ? WHERE DO_NO = ?',
        [SO_NO, tanggal_pengiriman, status, DO_NO],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Delivery Order telah diubah, mohon periksa kembali!' });
        }
    );
});

app.delete('/:DO_NO', (req, res) => {
    const { DO_NO } = req.params;
    db.query('DELETE FROM delivery_orders WHERE DO_NO = ?', [DO_NO], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Delivery Order dihapus!' });
    });
});

// Jalankan server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`DO service running on port ${PORT}`);
});