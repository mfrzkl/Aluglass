const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/logistics')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

const salesOrderSchema = new mongoose.Schema({
    nomor_pesanan: { type: String, required: true },
    tanggal_pesanan: { type: Date, required: true },
    pelanggan: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
    produk: [
        {
            nama_produk: { type: String, required: true },
            jumlah: { type: Number, required: true },
            harga_satuan: { type: Number, required: true },
        },
    ],
    total_harga: { type: Number, required: true },
});

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);

// Endpoint Sales Order
app.get('/sales-orders', async (req, res) => {
    try {
        const orders = await SalesOrder.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error membaca data Sales Order' });
    }
});

app.post('/sales-orders', async (req, res) => {
    try {
        const { nomor_pesanan, tanggal_pesanan, pelanggan, produk } = req.body;
        const total_harga = produk.reduce((total, item) => total + item.jumlah * item.harga_satuan, 0);

        const newOrder = new SalesOrder({
            nomor_pesanan,
            tanggal_pesanan,
            pelanggan,
            produk,
            total_harga,
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan Sales Order' });
    }
});

app.put('/sales-orders/:id', async (req, res) => {
    try {
        const updatedOrder = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Sales Order tidak ditemukan' });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui Sales Order' });
    }
});

app.delete('/sales-orders/:id', async (req, res) => {
    try {
        const deletedOrder = await SalesOrder.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Sales Order tidak ditemukan' });
        }
        res.json({ message: 'Sales Order berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus Sales Order' });
    }
});

// Menjalankan server Sales Order
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Sales Order Service berjalan di http://localhost:${PORT}`);
});
