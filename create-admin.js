// Script để tạo tài khoản admin
const fetch = require('node-fetch');

async function createAdmin() {
  try {
    const response = await fetch('http://localhost:8888/users/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin',
        email: 'admin@admin.com',
        password: '123456'
      }),
    });

    const data = await response.json();
    console.log('Kết quả:', data);
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

createAdmin();