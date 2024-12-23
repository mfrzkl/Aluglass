const express = require('express');
const shipmentService = express.Router();
const db = require('../../db/connections');

// Create a new shipment
shipmentService.post('/', (req, res) => {
    const { nomor_pengiriman, SO, DO, produk, tanggal_pengiriman, tanggal_diterima, status } = req.body;
    db.query(
        'INSERT INTO shipments (nomor_pengiriman, SO, DO, produk, tanggal_pengiriman, tanggal_diterima, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nomor_pengiriman, SO, DO, JSON.stringify(produk), tanggal_pengiriman, tanggal_diterima, status],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Shipment dibuat', id: results.insertId });
        }
    );
});

// Get all shipments
shipmentService.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM shipments');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific shipment by nomor_pengiriman
shipmentService.get('/:nomor_pengiriman', (req, res) => {
    const { nomor_pengiriman } = req.params;
    db.query('SELECT * FROM shipments WHERE nomor_pengiriman = ?', [nomor_pengiriman], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Shipment tidak ditemukan' });
        res.json(results[0]);
    });
});

// Update a shipment
shipmentService.put('/:nomor_pengiriman', (req, res) => {
    const { nomor_pengiriman } = req.params;
    const { SO, DO, produk, tanggal_pengiriman, tanggal_diterima, status } = req.body;
    db.query(
        'UPDATE shipments SET SO = ?, DO = ?, produk = ?, tanggal_pengiriman = ?, tanggal_diterima = ?, status = ? WHERE nomor_pengiriman = ?',
        [SO, DO, JSON.stringify(produk), tanggal_pengiriman, tanggal_diterima, status, nomor_pengiriman],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Shipment diupdate' });
        }
    );
});

// Delete a shipment by nomor_pengiriman
shipmentService.delete('/:nomor_pengiriman', (req, res) => {
    const { nomor_pengiriman } = req.params;
    db.query('DELETE FROM shipments WHERE nomor_pengiriman = ?', [nomor_pengiriman], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Shipment dihapus' });
    });
});

// Jalankan server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Inventory service running on port ${PORT}`);
});