// Import module yang diperlukan
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inisialisasi aplikasi
const app = express();
app.use(bodyParser.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Koneksi MongoDB gagal:'));
db.once('open', () => {
    console.log('Terkoneksi ke MongoDB');
});

// Skema untuk Inventaris Produk
const inventorySchema = new mongoose.Schema({
    nama_produk: { type: String, required: true },
    kategori: { type: String, enum: ['kaca', 'alumunium'], required: true },
    warna: { type: String, required: true },
    ketebalan: { type: Number, required: true }, // dalam mm
    dimensi: { 
        panjang: { type: Number, required: true }, // dalam cm
        lebar: { type: Number, required: true },   // dalam cm
    },
    stok: { type: Number, required: true },
    harga_satuan: { type: Number, required: true },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

// Endpoint untuk Inventory
app.get('/inventories', async (req, res) => {
    try {
        const inventories = await Inventory.find();
        res.json(inventories);
    } catch (error) {
        res.status(500).json({ message: 'Error membaca data inventaris' });
    }
});

app.post('/inventories', async (req, res) => {
    try {
        const { nama_produk, kategori, warna, ketebalan, dimensi, stok, harga_satuan } = req.body;

        const newInventory = new Inventory({
            nama_produk,
            kategori,
            warna,
            ketebalan,
            dimensi,
            stok,
            harga_satuan,
        });

        await newInventory.save();
        res.status(201).json(newInventory);
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan inventaris' });
    }
});

app.put('/inventories/:id', async (req, res) => {
    try {
        const updatedInventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInventory) {
            return res.status(404).json({ message: 'Inventaris tidak ditemukan' });
        }
        res.json(updatedInventory);
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui inventaris' });
    }
});

app.delete('/inventories/:id', async (req, res) => {
    try {
        const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedInventory) {
            return res.status(404).json({ message: 'Inventaris tidak ditemukan' });
        }
        res.json({ message: 'Inventaris berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus inventaris' });
    }
});

// Menjalankan server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server inventaris berjalan di http://localhost:${PORT}`);
});