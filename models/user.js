const bcrypt = require('bcryptjs');
let users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10), 
        desc: 'Super User & System Administrator'
    },
    {
        id: 2,
        username: 'Staff Gudang',
        password: bcrypt.hashSync('password', 10),
        role: 'Staff',
        desc: 'Akses tabel inventory (CRUD)'
    },
    {
        id: 3,
        username: 'Operasional',
        password: bcrypt.hashSync('password', 10), 
        role: 'ops',
        desc: 'Akses tabel delivey-order (membuat delivery setelah SO ada) dan tabel shipments (CRUD)'
    },
    {
        id: 4,
        username: 'Sales Accounting',
        password: bcrypt.hashSync('password', 10), 
        role: 'Sales',
        desc: 'Membuat sales-order (CRUD)'
    },
    {
        id: 5,
        username: 'Customer',
        password: bcrypt.hashSync('password', 10), 
        role: 'Cust',
    },
];
module.exports = {
    findByUsername: (username) => users.find(user => 
        user.username === username),
    findById: (id) => users.find(user => user.id === id),
};