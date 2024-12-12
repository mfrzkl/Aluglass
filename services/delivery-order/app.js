const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 3003;
const app = express();
app.use(bodyParser.json());

// Koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/logistics')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

const deliveryOrderSchema = new mongoose.Schema({
    nomor_pengiriman: { type: String, required: true },
    tanggal_pengiriman: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in transit', 'delivered'], default: 'pending' },
    sales_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder', required: true },
});

const DeliveryOrder = mongoose.model('DeliveryOrder', deliveryOrderSchema);

// Endpoint Delivery Order
app.get('/delivery-orders', async (req, res) => {
    try {
        const deliveries = await DeliveryOrder.find().populate('sales_order_id');
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: 'Error membaca data Delivery Order' });
    }
});

app.post('/delivery-orders', async (req, res) => {
    try {
        const { nomor_pengiriman, tanggal_pengiriman, sales_order_id } = req.body;

        const newDelivery = new DeliveryOrder({
            nomor_pengiriman,
            tanggal_pengiriman,
            sales_order_id,
        });

        await newDelivery.save();
        res.status(201).json(newDelivery);
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan Delivery Order' });
    }
});

app.put('/delivery-orders/:id', async (req, res) => {
    try {
        const updatedDelivery = await DeliveryOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDelivery) {
            return res.status(404).json({ message: 'Delivery Order tidak ditemukan' });
        }
        res.json(updatedDelivery);
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui Delivery Order' });
    }
})