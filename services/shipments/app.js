const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 3002;

const app = express();
app.use(bodyParser.json());

// Koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/logistics')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Skema untuk tabel Shipments
const shipmentSchema = new mongoose.Schema({
    nomor_pengiriman: { type: String, required: true },
    sales_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder', required: true },
    delivery_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryOrder', required: true },
    produk: [
        {
            nama_produk: { type: String, required: true },
            jumlah: { type: Number, required: true },
            status: { type: String, enum: ['pending', 'in transit', 'delivered'], default: 'pending' }
        }
    ],
    tanggal_pengiriman: { type: Date, required: true },
    tanggal_diterima: { type: Date },
    status: { type: String, enum: ['pending', 'in transit', 'delivered', 'canceled'], default: 'pending' }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;