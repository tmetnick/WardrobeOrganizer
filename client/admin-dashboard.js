// admin-dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const BASE_URL = 'https://wardrobeorganizer.onrender.com';

  if (!token) {
    alert("Unauthorized access. Please log in.");
    window.location.href = 'login.html';
    return;
  }

  async function fetchUsers() {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    console.log('Fetched users:', data);

    if (!Array.isArray(data)) {
      console.error('Expected array but got:', data);
      return;
    }

    const tbody = document.querySelector('#user-table tbody');
    tbody.innerHTML = '';

    data.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.isActive ? 'Active' : 'Inactive'}</td>
        <td>
          <button class="activate" onclick="updateUser('${user._id}', true)">Activate</button>
          <button class="deactivate" onclick="updateUser('${user._id}', false)">Deactivate</button>
          <button class="deactivate" onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  async function updateUser(id, isActive) {
    await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isActive })
    });
    fetchUsers();
  }

  async function deleteUser(id) {
    await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchUsers();
  }

  async function fetchItems() {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/clothes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const items = await res.json();
      const tbody = document.querySelector('#content-table tbody');
      tbody.innerHTML = '';

      items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name || 'Unnamed Item'}</td>
          <td>${item.status || 'pending'}</td>
          <td>${item.userEmail || 'Unknown'}</td>
          <td>
            <button class="approve" onclick="updateItem('${item._id}', 'approved')">Approve</button>
            <button class="reject" onclick="updateItem('${item._id}', 'rejected')">Reject</button>
            <button class="deactivate" onclick="deleteItem('${item._id}')">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  }

  async function updateItem(id, status) {
    await fetch(`${BASE_URL}/api/admin/clothes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    fetchItems();
  }

  async function deleteItem(id) {
    await fetch(`${BASE_URL}/api/admin/clothes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchItems();
  }

  window.updateUser = updateUser;
  window.deleteUser = deleteUser;
  window.updateItem = updateItem;
  window.deleteItem = deleteItem;

  fetchUsers();
  fetchItems();
});