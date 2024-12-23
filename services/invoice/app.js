const express = require('express');
const invoiceService = express();
const db = require('../../db/connections');

invoiceService.post('/', (req, res) => {
    const { invoice_no, sales_name, metode_pembayaran, tanggal_pembayaran, status_pembayaran, tanggal_penagihan, customer, nominal, produk } = req.body;
    db.query(
        'INSERT INTO invoices (invoice_no, sales_name, metode_pembayaran, tanggal_pembayaran, status_pembayaran, tanggal_penagihan, customer, nominal, produk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [invoice_no, sales_name, metode_pembayaran, tanggal_pembayaran, status_pembayaran, tanggal_penagihan, customer, nominal, JSON.stringify(produk)],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Invoice created', id: results.insertId });
        }
    );
});

// Get all invoices
invoiceService.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM invoices');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single invoice by invoice_no
invoiceService.get('/:invoice_no', (req, res) => {
    const { invoice_no } = req.params;
    db.query('SELECT * FROM invoices WHERE invoice_no = ?', [invoice_no], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Invoice not found' });
        res.json(results[0]);
    });
});

// Update an existing invoice
invoiceService.put('/:invoice_no', (req, res) => {
    const { invoice_no } = req.params;
    const { sales_name, metode_pembayaran, tanggal_pembayaran, status_pembayaran, tanggal_penagihan, customer, nominal, produk } = req.body;
    db.query(
        'UPDATE invoices SET sales_name = ?, metode_pembayaran = ?, tanggal_pembayaran = ?, status_pembayaran = ?, tanggal_penagihan = ?, customer = ?, nominal = ?, produk = ? WHERE invoice_no = ?',
        [sales_name, metode_pembayaran, tanggal_pembayaran, status_pembayaran, tanggal_penagihan, customer, nominal, JSON.stringify(produk), invoice_no],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Invoice updated' });
        }
    );
});

// Delete an invoice by invoice_no
invoiceService.delete('/:invoice_no', (req, res) => {
    const { invoice_no } = req.params;
    db.query('DELETE FROM invoices WHERE invoice_no = ?', [invoice_no], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Invoice deleted' });
    });
});

// Jalankan server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Inventory service running on port ${PORT}`);
});