// Mock Database Items for ERP System
const products = [
  { id: 1, name: 'Espresso Classic', category: 'Minuman Kopi', price: 22000, stock: 'Aman (Kopi Arabika)' },
  { id: 2, name: 'Kopi Susu Gula Aren', category: 'Minuman Kopi', price: 25000, stock: 'Aman' },
  { id: 3, name: 'Biji Kopi Kintamani 250g', category: 'Bijian Kopi', price: 85000, stock: 'Stok: 40 Pack' },
  { id: 4, name: 'Croissant Butter', category: 'Makanan', price: 28000, stock: 'Stok: 15 Pcs' },
  { id: 5, name: 'Manual Brew V60', category: 'Minuman Kopi', price: 30000, stock: 'Aman' },
  { id: 6, name: 'Biji Kopi Gayo 250g', category: 'Bijian Kopi', price: 90000, stock: 'Stok: 25 Pack' }
];

const inventoryData = [
  { code: 'RAW-001', name: 'Biji Kopi Arabika Kintamani', cat: 'Bahan Baku', stock: 120, min: 30, unit: 'Kg', status: 'Aman' },
  { code: 'RAW-002', name: 'Biji Kopi Robusta Pupuan', cat: 'Bahan Baku', stock: 85, min: 25, unit: 'Kg', status: 'Aman' },
  { code: 'RAW-003', name: 'Susu UHT Fresh Milk', cat: 'Bahan Baku', stock: 12, min: 20, unit: 'Liter', status: 'Mendekati Batas' },
  { code: 'RAW-004', name: 'Gula Aren Cair Organic', cat: 'Bahan Baku', stock: 8, min: 15, unit: 'Liter', status: 'Mendekati Batas' },
  { code: 'PKG-001', name: 'Cup Cold Coffee 16oz', cat: 'Kemasan', stock: 1500, min: 300, unit: 'Pcs', status: 'Aman' }
];

let cart = [];

// Initialize Dashboard & Functions on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderPOSProducts();
  renderInventoryTable();
  initCharts();
});

// Navigation Handling
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');

  const titles = {
    'dashboard': 'Dashboard Executive',
    'pos': 'Point of Sales & Kasir Penjualan',
    'inventory': 'Manajemen Stok & Bahan Baku',
    'procurement': 'Pengadaan (Purchase Orders)',
    'finance': 'Keuangan & Akuntansi Terintegrasi',
    'hr': 'Manajemen SDM & Payroll'
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      tabContents.forEach(content => {
        content.classList.add('hidden');
      });

      document.getElementById(`tab-${targetTab}`).classList.remove('hidden');
      pageTitle.textContent = titles[targetTab];
    });
  });
}

// Render POS Products
function renderPOSProducts() {
  const container = document.getElementById('pos-products');
  container.innerHTML = products.map(p => `
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between" onclick="addToCart(${p.id})">
      <div>
        <span class="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">${p.category}</span>
        <h4 class="font-bold text-slate-800 text-sm mt-2">${p.name}</h4>
        <p class="text-xs text-slate-400 mt-0.5">${p.stock}</p>
      </div>
      <div class="mt-4 flex justify-between items-center">
        <span class="font-bold text-slate-800 text-sm">Rp ${p.price.toLocaleString('id-ID')}</span>
        <button class="w-7 h-7 rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center text-xs shadow-md">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// POS Cart Operations
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById('cart-items');
  if (cart.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 text-center py-8">Belum ada item dipilih</p>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg text-xs">
        <div>
          <p class="font-bold text-slate-800">${item.name}</p>
          <p class="text-slate-400">Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-bold text-slate-800">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
          <button onclick="removeFromCart(${item.id})" class="text-rose-500 hover:text-rose-700 pl-2"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `).join('');
  }

  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  document.getElementById('cart-subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
  document.getElementById('cart-tax').textContent = `Rp ${tax.toLocaleString('id-ID')}`;
  document.getElementById('cart-total').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function processCheckout() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }
  alert('Transaksi berhasil diproses!\n- Stok bahan baku otomatis terpotong di modul Inventory.\n- Arus kas masuk dicatat otomatis di modul Keuangan.');
  cart = [];
  updateCartUI();
}

// Render Inventory Table
function renderInventoryTable() {
  const body = document.getElementById('inventory-table-body');
  body.innerHTML = inventoryData.map(item => {
    const isWarning = item.stock <= item.min;
    return `
      <tr class="hover:bg-slate-50/50 transition-colors">
        <td class="p-4 font-mono font-medium text-slate-800">${item.code}</td>
        <td class="p-4 font-semibold text-slate-800">${item.name}</td>
        <td class="p-4">${item.cat}</td>
        <td class="p-4 font-bold ${isWarning ? 'text-amber-600' : 'text-slate-800'}">${item.stock} ${item.unit}</td>
        <td class="p-4 text-slate-400">${item.min} ${item.unit}</td>
        <td class="p-4">
          <span class="px-2 py-0.5 rounded-full font-semibold text-[10px] ${isWarning ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">
            ${item.status}
          </span>
        </td>
        <td class="p-4 text-center">
          <button onclick="showModal('Update Stok', 'Sesuaikan stok ${item.name}')" class="text-amber-600 hover:underline font-medium">Restok</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Chart.js Visualizations
function initCharts() {
  // Line Chart
  const ctxSales = document.getElementById('salesChart').getContext('2d');
  new Chart(ctxSales, {
    type: 'line',
    data: {
      labels: ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
      datasets: [
        {
          label: 'Pendapatan (Rp)',
          data: [32000000, 38000000, 41000000, 40000000, 45000000, 48500000],
          borderColor: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Beban Operasional & HPP (Rp)',
          data: [20000000, 23000000, 25000000, 24000000, 28000000, 30700000],
          borderColor: '#64748b',
          borderDash: [5, 5],
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Doughnut Chart
  const ctxCat = document.getElementById('categoryChart').getContext('2d');
  new Chart(ctxCat, {
    type: 'doughnut',
    data: {
      labels: ['Minuman Kopi', 'Bijian Kopi Pack', 'Makanan / Pastry'],
      datasets: [{
        data: [55, 30, 15],
        backgroundColor: ['#d97706', '#059669', '#3b82f6']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// Modal Helpers
function showModal(title, desc) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-desc').textContent = desc;
  document.getElementById('app-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('app-modal').classList.add('hidden');
}
