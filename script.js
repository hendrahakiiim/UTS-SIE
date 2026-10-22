// Mock Data
const products = [
  { id: 1, name: 'Espresso Classic', category: 'Minuman Kopi', price: 22000, stock: 'Aman' },
  { id: 2, name: 'Kopi Susu Gula Aren', category: 'Minuman Kopi', price: 25000, stock: 'Aman' },
  { id: 3, name: 'Biji Kopi Kintamani 250g', category: 'Bijian Kopi', price: 85000, stock: 'Stok: 40 Pack' },
  { id: 4, name: 'Croissant Butter', category: 'Makanan', price: 28000, stock: 'Stok: 15 Pcs' },
  { id: 5, name: 'Manual Brew V60', category: 'Minuman Kopi', price: 30000, stock: 'Aman' }
];

const inventoryData = [
  { code: 'RAW-001', name: 'Biji Kopi Arabika Kintamani', cat: 'Bahan Baku', stock: '120 Kg', status: 'Aman' },
  { code: 'RAW-002', name: 'Susu UHT Fresh Milk', cat: 'Bahan Baku', stock: '12 Liter', status: 'Menipis' },
  { code: 'PKG-001', name: 'Cup Cold Coffee 16oz', cat: 'Kemasan', stock: '1500 Pcs', status: 'Aman' }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderPOSProducts();
  renderInventoryTable();
  initCharts();
});

// Sidebar Mobile Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
}

// Navigation Handling
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');

  const titles = {
    'dashboard': 'Dashboard Executive',
    'pos': 'POS & Penjualan',
    'inventory': 'Stok & Bahan Baku',
    'procurement': 'Pengadaan (PO)',
    'finance': 'Keuangan & Akuntansi',
    'hr': 'SDM & Penggajian'
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      tabContents.forEach(content => content.classList.add('hidden'));
      document.getElementById(`tab-${targetTab}`).classList.remove('hidden');
      pageTitle.textContent = titles[targetTab];

      // Close sidebar automatically on mobile click
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    });
  });
}

// POS Product Renderer
function renderPOSProducts() {
  const container = document.getElementById('pos-products');
  container.innerHTML = products.map(p => `
    <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between" onclick="addToCart(${p.id})">
      <div>
        <span class="text-[9px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">${p.category}</span>
        <h4 class="font-bold text-slate-800 text-xs md:text-sm mt-1.5">${p.name}</h4>
      </div>
      <div class="mt-3 flex justify-between items-center">
        <span class="font-bold text-slate-800 text-xs md:text-sm">Rp ${p.price.toLocaleString('id-ID')}</span>
        <button class="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-[10px]">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  `).join('');
}

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
    container.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Belum ada item dipilih</p>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs">
        <div>
          <p class="font-bold text-slate-800">${item.name}</p>
          <p class="text-[10px] text-slate-400">Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="font-bold text-slate-800">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
          <button onclick="removeFromCart(${item.id})" class="text-rose-500 text-xs pl-1"><i class="fa-solid fa-trash"></i></button>
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
  if (cart.length === 0) return alert('Keranjang masih kosong!');
  alert('Transaksi berhasil diproses!\n- Stok bahan baku otomatis terpotong di modul Inventory.\n- Arus kas masuk dicatat di modul Keuangan.');
  cart = [];
  updateCartUI();
}

function renderInventoryTable() {
  const body = document.getElementById('inventory-table-body');
  body.innerHTML = inventoryData.map(item => `
    <tr class="hover:bg-slate-50">
      <td class="p-3 md:p-4 font-mono font-medium">${item.code}</td>
      <td class="p-3 md:p-4 font-semibold text-slate-800">${item.name}</td>
      <td class="p-3 md:p-4">${item.cat}</td>
      <td class="p-3 md:p-4 font-bold text-slate-800">${item.stock}</td>
      <td class="p-3 md:p-4"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[10px]">${item.status}</span></td>
      <td class="p-3 md:p-4 text-center"><button onclick="showModal('Restok Item', 'Update persediaan ${item.name}')" class="text-amber-600 font-medium hover:underline">Restok</button></td>
    </tr>
  `).join('');
}

function initCharts() {
  const ctxSales = document.getElementById('salesChart').getContext('2d');
  new Chart(ctxSales, {
    type: 'line',
    data: {
      labels: ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
      datasets: [{
        label: 'Pendapatan (Rp)',
        data: [32000000, 38000000, 41000000, 40000000, 45000000, 48500000],
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const ctxCat = document.getElementById('categoryChart').getContext('2d');
  new Chart(ctxCat, {
    type: 'doughnut',
    data: {
      labels: ['Minuman', 'Bijian Kopi', 'Makanan'],
      datasets: [{ data: [55, 30, 15], backgroundColor: ['#d97706', '#059669', '#3b82f6'] }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function showModal(title, desc) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-desc').textContent = desc;
  document.getElementById('app-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('app-modal').classList.add('hidden');
}