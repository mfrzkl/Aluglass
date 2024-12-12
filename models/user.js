const bcrypt = require('bcryptjs');

// Data pengguna sementara
let users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10), 
        role: 'Admin',
        desc: 'Super User & System Administrator'
    },
    {
        id: 2,
        username: 'staff@gudang',
        password: bcrypt.hashSync('password', 10),
        role: 'Staff',
        desc: 'Akses tabel inventory (CRUD)'
    },
    {
        id: 3,
        username: 'operasional',
        password: bcrypt.hashSync('password', 10), 
        role: 'ops',
        desc: 'Akses tabel delivery-order dan shipments (CRUD)'
    },
    {
        id: 4,
        username: 'sales@accounting',
        password: bcrypt.hashSync('password', 10), 
        role: 'Sales',
        desc: 'Membuat sales-order (CRUD)'
    },
    {
        id: 5,
        username: 'customer',
        password: bcrypt.hashSync('password', 10), 
        role: 'Cust',
    },
];

module.exports = {
    findByUsername: (username) => users.find(user => user.username === username),
    findById: (id) => users.find(user => user.id === id),
};
