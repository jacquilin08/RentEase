/* ═══════════════════════════════════════════════════════════
   RENTEASE — app.js
   Complete logic: Auth · User · Admin · Data · UI
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   1. DATA STORE
───────────────────────────────────────────── */

const DB = {

  currentUser: null,
  isAdmin: false,
  cart: [],          // { ...product, tenure, qty }
  selectedTenures: {},

  products: [
    { id:1,  name:'Nordic King Bed',          category:'Furniture',  type:'Bed',             emoji:'🛏️', rent:1299, deposit:2500, tenure:[3,6,12], badge:'popular', rating:4.8, reviews:124, stock:8,  description:'Solid wood frame with premium upholstered headboard. Available in walnut and ash finishes.' },
    { id:2,  name:'3-Seater Sectional Sofa',  category:'Furniture',  type:'Sofa',            emoji:'🛋️', rent:899,  deposit:1800, tenure:[3,6,12], badge:'deal',    rating:4.7, reviews:89,  stock:5,  description:'L-shaped sectional sofa with removable washable covers. High-density foam cushions.' },
    { id:3,  name:'Samsung Fridge 320L',      category:'Appliances', type:'Refrigerator',    emoji:'❄️', rent:849,  deposit:2000, tenure:[3,6,12], badge:'new',     rating:4.9, reviews:203, stock:12, description:'Double-door inverter refrigerator with 5-star energy rating and digital display.' },
    { id:4,  name:'LG Front Load 7kg',        category:'Appliances', type:'Washing Machine', emoji:'🧺', rent:699,  deposit:1500, tenure:[3,6,12], badge:'popular', rating:4.6, reviews:156, stock:9,  description:'Front-load washing machine with 10 wash programs and steam care feature.' },
    { id:5,  name:'Sony Bravia 55" 4K',       category:'Appliances', type:'TV',              emoji:'📺', rent:799,  deposit:1800, tenure:[3,6,12], badge:'new',     rating:4.8, reviews:97,  stock:7,  description:'4K HDR Android TV with Google Assistant, Dolby Atmos and built-in Chromecast.' },
    { id:6,  name:'Study Table & Chair Set',  category:'Furniture',  type:'Table',           emoji:'🪑', rent:499,  deposit:1000, tenure:[1,3,6,12], badge:'deal',  rating:4.5, reviews:72,  stock:15, description:'Ergonomic study setup with height-adjustable chair and cable management tray.' },
    { id:7,  name:'Daikin 1.5T Split AC',     category:'Appliances', type:'AC',              emoji:'🌡️', rent:1099, deposit:2500, tenure:[3,6,12], badge:'popular', rating:4.7, reviews:118, stock:6,  description:'5-star inverter AC with PM 2.5 filter, auto-clean and weekly timer function.' },
    { id:8,  name:'3-Door Wardrobe',          category:'Furniture',  type:'Wardrobe',        emoji:'🚪', rent:749,  deposit:1500, tenure:[3,6,12], badge:'new',     rating:4.6, reviews:64,  stock:10, description:'Spacious wardrobe with mirror, pull-out drawers and soft-close hinges.' },
    { id:9,  name:'Dining Table 4-Seater',    category:'Furniture',  type:'Dining',          emoji:'🍽️', rent:649,  deposit:1200, tenure:[3,6,12], badge:'deal',    rating:4.5, reviews:53,  stock:8,  description:'Solid teak dining table with 4 cushioned chairs. Scratch-resistant surface.' },
    { id:10, name:'Microwave Oven 25L',       category:'Appliances', type:'Microwave',       emoji:'📦', rent:399,  deposit:800,  tenure:[1,3,6],  badge:'new',     rating:4.4, reviews:88,  stock:14, description:'Convection microwave with grill, 26 auto-cook menus and child lock.' },
    { id:11, name:'Office Chair Ergonomic',   category:'Furniture',  type:'Chair',           emoji:'💺', rent:399,  deposit:800,  tenure:[1,3,6,12], badge:'popular',rating:4.6,reviews:110, stock:20, description:'Mesh back ergonomic chair with lumbar support, armrests and 5-wheel base.' },
    { id:12, name:'Whirlpool Top Load 6.5kg', category:'Appliances', type:'Washing Machine', emoji:'🫧', rent:599,  deposit:1200, tenure:[3,6,12], badge:'deal',    rating:4.4, reviews:74,  stock:11, description:'Top-load fully automatic washing machine with 12 wash programs.' },
  ],

  users: [
    { id:'USR001', name:'Jane Doe',     email:'jane@example.com',   city:'Bangalore', rentals:3, joined:'Jan 2024', status:'active'   },
    { id:'USR002', name:'Arjun Kumar',  email:'arjun@email.com',    city:'Mumbai',    rentals:7, joined:'Mar 2023', status:'active'   },
    { id:'USR003', name:'Priya Sharma', email:'priya@mail.com',     city:'Hyderabad', rentals:2, joined:'Jun 2024', status:'active'   },
    { id:'USR004', name:'Rahul Nair',   email:'rahul@example.com',  city:'Pune',      rentals:5, joined:'Nov 2022', status:'inactive' },
    { id:'USR005', name:'Sneha Rao',    email:'sneha@mail.com',     city:'Chennai',   rentals:4, joined:'Feb 2024', status:'active'   },
    { id:'USR006', name:'Kiran Mehta',  email:'kiran@email.com',    city:'Delhi',     rentals:1, joined:'Jul 2024', status:'active'   },
  ],

  activeRentals: [
    { id:'ORD2401', productId:1, productName:'Nordic King Bed',    emoji:'🛏️', tenure:6,  start:'12 Jan 2025', end:'12 Jul 2025', amount:10294, status:'active',   progress:55, city:'Bangalore' },
    { id:'ORD2402', productId:3, productName:'Samsung Fridge 320L',emoji:'❄️', tenure:12, start:'05 Mar 2025', end:'05 Mar 2026', amount:12188, status:'active',   progress:25, city:'Bangalore' },
    { id:'ORD2403', productId:7, productName:'Daikin 1.5T Split AC',emoji:'🌡️',tenure:3,  start:'01 Jun 2025', end:'01 Sep 2025', amount:5797,  status:'upcoming', progress:5,  city:'Bangalore' },
  ],

  rentalHistory: [
    { id:'ORD2201', product:'Sony Bravia 55" 4K',    emoji:'📺', tenure:'6 mo', start:'Jan 2022', end:'Jul 2022', amount:'₹6,594',  status:'completed' },
    { id:'ORD2205', product:'Study Table & Chair',   emoji:'🪑', tenure:'3 mo', start:'Aug 2022', end:'Nov 2022', amount:'₹2,497',  status:'completed' },
    { id:'ORD2301', product:'LG Front Load 7kg',     emoji:'🧺', tenure:'6 mo', start:'Feb 2023', end:'Aug 2023', amount:'₹5,694',  status:'completed' },
    { id:'ORD2305', product:'3-Seater Sectional Sofa',emoji:'🛋️',tenure:'12 mo',start:'Sep 2023', end:'Sep 2024', amount:'₹12,588', status:'completed' },
    { id:'ORD2401', product:'Nordic King Bed',       emoji:'🛏️', tenure:'6 mo', start:'Jan 2025', end:'Jul 2025', amount:'₹10,294', status:'active'    },
  ],

  maintenanceHistory: [
    { id:'MNT001', product:'Nordic King Bed',     issue:'Loose bolt on headboard', date:'14 Apr 2025', status:'resolved',  priority:'low'  },
    { id:'MNT002', product:'Samsung Fridge 320L', issue:'Ice maker not working',   date:'02 May 2025', status:'in-progress',priority:'high' },
  ],

  adminRentals: [
    { id:'ORD2401', customer:'Jane Doe',     product:'Nordic King Bed',     tenure:'6 mo', amount:'₹10,294', delivery:'12 Jan 2025', status:'active'    },
    { id:'ORD2402', customer:'Jane Doe',     product:'Samsung Fridge 320L', tenure:'12 mo',amount:'₹12,188', delivery:'05 Mar 2025', status:'active'    },
    { id:'ORD2403', customer:'Jane Doe',     product:'Daikin 1.5T AC',      tenure:'3 mo', amount:'₹5,797',  delivery:'01 Jun 2025', status:'upcoming'  },
    { id:'ORD2351', customer:'Arjun Kumar',  product:'Sony Bravia 55"',     tenure:'6 mo', amount:'₹6,594',  delivery:'15 Feb 2025', status:'active'    },
    { id:'ORD2352', customer:'Arjun Kumar',  product:'LG Washing Machine',  tenure:'12 mo',amount:'₹9,888',  delivery:'20 Feb 2025', status:'active'    },
    { id:'ORD2361', customer:'Priya Sharma', product:'3-Door Wardrobe',     tenure:'3 mo', amount:'₹3,747',  delivery:'10 Apr 2025', status:'active'    },
    { id:'ORD2371', customer:'Rahul Nair',   product:'Dining Table 4-Seat', tenure:'6 mo', amount:'₹5,094',  delivery:'01 Jan 2025', status:'completed' },
    { id:'ORD2381', customer:'Sneha Rao',    product:'Office Chair Ergo',   tenure:'1 mo', amount:'₹1,199',  delivery:'01 May 2025', status:'pending'   },
  ],

  damageClaims: [
    { id:'CLM001', customer:'Arjun Kumar',  product:'Sony Bravia 55"', emoji:'📺', desc:'Screen cracked on one corner during relocation by customer.', amount:'₹4,500', date:'10 Apr 2025', status:'pending'  },
    { id:'CLM002', customer:'Rahul Nair',   product:'Dining Table',    emoji:'🍽️', desc:'Deep scratch marks on table top surface.',                    amount:'₹800',   date:'20 Mar 2025', status:'resolved' },
    { id:'CLM003', customer:'Kiran Mehta',  product:'Office Chair',    emoji:'💺', desc:'Armrest broken, likely due to excessive weight loading.',      amount:'₹600',   date:'15 May 2025', status:'pending'  },
    { id:'CLM004', customer:'Priya Sharma', product:'3-Door Wardrobe', emoji:'🚪', desc:'One door hinge snapped off during use.',                       amount:'₹1,200', date:'28 Apr 2025', status:'in-progress' },
  ],

  serviceAreas: [
    { city:'Bangalore', state:'Karnataka', warehouses:3, activeRentals:1842, deliveryDays:'1-2', status:'active',  coverage:'95%' },
    { city:'Mumbai',    state:'Maharashtra',warehouses:4, activeRentals:2310, deliveryDays:'1-2', status:'active',  coverage:'92%' },
    { city:'Delhi NCR', state:'Delhi',     warehouses:5, activeRentals:2890, deliveryDays:'1-2', status:'active',  coverage:'90%' },
    { city:'Hyderabad', state:'Telangana', warehouses:2, activeRentals:980,  deliveryDays:'2-3', status:'active',  coverage:'85%' },
    { city:'Chennai',   state:'Tamil Nadu',warehouses:2, activeRentals:756,  deliveryDays:'2-3', status:'active',  coverage:'80%' },
    { city:'Coimbatore',state:'Tamil Nadu',warehouses:1, activeRentals:312,  deliveryDays:'2-3', status:'active',  coverage:'70%' },
    { city:'Pune',      state:'Maharashtra',warehouses:2, activeRentals:640, deliveryDays:'2-3', status:'active',  coverage:'78%' },
    { city:'Ahmedabad', state:'Gujarat',   warehouses:1, activeRentals:280,  deliveryDays:'3-4', status:'limited', coverage:'60%' },
    { city:'Kolkata',   state:'West Bengal',warehouses:1, activeRentals:190, deliveryDays:'3-4', status:'limited', coverage:'55%' },
    { city:'Jaipur',    state:'Rajasthan', warehouses:1, activeRentals:140,  deliveryDays:'4-5', status:'limited', coverage:'45%' },
    { city:'Lucknow',   state:'UP',        warehouses:0, activeRentals:0,    deliveryDays:'TBD', status:'coming',  coverage:'0%'  },
    { city:'Kochi',     state:'Kerala',    warehouses:0, activeRentals:0,    deliveryDays:'TBD', status:'coming',  coverage:'0%'  },
  ],
};


/* ─────────────────────────────────────────────
   2. AUTH
───────────────────────────────────────────── */

function switchAuth(form) {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById('form-' + form).classList.add('active');
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value.trim();
  if (!email || !pass) { showToast('Please enter email and password', '⚠️'); return; }

  // Demo: admin check
  if (email === 'admin@rentease.com' && pass === 'admin123') {
    loginAsAdmin(); return;
  }
  // Any other creds → user login
  DB.currentUser = { name: 'Jane Doe', email, initials: 'JD' };
  DB.isAdmin = false;
  launchUser();
}

function doRegister() {
  showToast('Account created! Please sign in.', '🎉');
  switchAuth('login');
}

function loginAsAdmin() {
  DB.currentUser = { name: 'Admin', email: 'admin@rentease.com', initials: 'A' };
  DB.isAdmin = true;
  launchAdmin();
}

function logout() {
  DB.currentUser = null;
  DB.isAdmin = false;
  DB.cart = [];
  showPage('auth');
  switchAuth('login');
  document.getElementById('login-email').value    = '';
  document.getElementById('login-password').value = '';
  showToast('Logged out successfully', '👋');
}


/* ─────────────────────────────────────────────
   3. PAGE NAVIGATION
───────────────────────────────────────────── */

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
}

function launchUser() {
  showPage('user');
  updateTopbarName();
  renderFeaturedGrid();
  renderBrowseGrid();
  renderCatChips();
  renderRentals();
  renderHistory();
  renderMaintenanceHistory();
  updateCartBadge();
  showUserPage('home');
}

function launchAdmin() {
  showPage('admin');
  renderKPI();
  renderRecentOrders();
  renderInventoryAlerts();
  renderUsersTable(DB.users);
  renderInventoryTable(DB.products);
  renderAdminRentals(DB.adminRentals);
  renderClaims();
  renderAnalytics();
  renderServiceAreas();
  showAdminPage('dashboard');
}

function showUserPage(page) {
  document.querySelectorAll('.upage').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('upage-' + page);
  if (el) { el.classList.add('active'); el.scrollTop = 0; }

  document.querySelectorAll('#userSidebar .nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });

  // Close sidebar on mobile
  document.getElementById('userSidebar').classList.remove('open');

  // Lazy renders
  if (page === 'cart')     renderCart();
  if (page === 'checkout') renderCheckout();
  if (page === 'history')  renderHistory();
}

function showAdminPage(page) {
  document.querySelectorAll('.apage').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('apage-' + page);
  if (el) el.classList.add('active');

  document.querySelectorAll('#adminSidebar .nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });

  document.getElementById('adminPageTitle').textContent = {
    dashboard:     'Dashboard',
    users:         'User Management',
    inventory:     'Inventory Management',
    'rentals-admin': 'Rental Monitoring',
    claims:        'Damage Claims',
    analytics:     'Reports & Analytics',
    serviceareas:  'Service Areas',
  }[page] || 'Dashboard';

  document.getElementById('adminSidebar').classList.remove('open');
}


/* ─────────────────────────────────────────────
   4. SIDEBAR TOGGLES
───────────────────────────────────────────── */

function toggleSidebar() {
  document.getElementById('userSidebar').classList.toggle('open');
}
function toggleAdminSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
}


/* ─────────────────────────────────────────────
   5. TOPBAR
───────────────────────────────────────────── */

function updateTopbarName() {
  if (DB.currentUser) {
    const el = document.getElementById('topbarName');
    if (el) el.textContent = DB.currentUser.name;
  }
}

function handleSearch(val) {
  if (!val.trim()) return;
  showUserPage('browse');
  document.getElementById('browseSearch').value = val;
  filterProducts();
}


/* ─────────────────────────────────────────────
   6. PRODUCT RENDERING
───────────────────────────────────────────── */

function productCardHTML(p, showAddBtn = true) {
  const badgeClass = { popular:'tag-popular', new:'tag-new', deal:'tag-deal' }[p.badge] || 'tag-new';
  const badgeLabel = { popular:'🔥 Popular', new:'✨ New', deal:'🎉 Deal' }[p.badge] || '';
  const inCart = DB.cart.find(c => c.id === p.id);
  return `
  <div class="product-card" onclick="openProductModal(${p.id})">
    <div class="product-img">
      <span>${p.emoji}</span>
      <span class="product-badge-tag ${badgeClass}">${badgeLabel}</span>
      <div class="wishlist ${inCart ? 'active' : ''}" onclick="event.stopPropagation(); quickAddCart(${p.id})" title="${inCart ? 'In Cart' : 'Add to Cart'}">
        ${inCart ? '🛒' : '＋'}
      </div>
    </div>
    <div class="product-body">
      <div class="product-cat">${p.category} · ${p.type}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating"><span class="stars">★★★★★</span> ${p.rating} (${p.reviews} reviews)</div>
      <div class="product-pricing">
        <div class="price-block">
          <div class="price-lbl">Monthly Rent</div>
          <div class="price-main">₹${p.rent.toLocaleString()}</div>
          <div class="price-tenure">Min. ${p.tenure[0]} month${p.tenure[0] > 1 ? 's' : ''}</div>
        </div>
        <div class="deposit-block">
          <div class="dep-lbl">Deposit</div>
          <div class="dep-amt">₹${p.deposit.toLocaleString()}</div>
        </div>
      </div>
    </div>
    <div class="product-footer">
      <button class="btn-rent-sm" onclick="event.stopPropagation(); quickAddCart(${p.id})">${inCart ? '✓ Added' : 'Add to Cart'}</button>
      <button class="btn-detail-sm" onclick="event.stopPropagation(); openProductModal(${p.id})">Details</button>
    </div>
  </div>`;
}

function renderFeaturedGrid() {
  const featured = DB.products.slice(0, 4);
  document.getElementById('featuredGrid').innerHTML = featured.map(p => productCardHTML(p)).join('');
}

function renderBrowseGrid(filtered = null) {
  const list = filtered ?? DB.products;
  const grid = document.getElementById('browseGrid');
  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text2)"><div style="font-size:3rem">🔍</div><p style="margin-top:12px">No products found. Try a different search.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(p => productCardHTML(p)).join('');
}

function renderCatChips() {
  const cats = ['All', 'Furniture', 'Appliances', 'Beds', 'Sofas', 'Refrigerators', 'TVs', 'ACs', 'Washing Machines'];
  document.getElementById('catChips').innerHTML = cats.map((c, i) =>
    `<button class="cat-chip ${i === 0 ? 'active' : ''}" onclick="selectCatChip(this, '${c}')">${c}</button>`
  ).join('');
}

function selectCatChip(el, cat) {
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('catFilter').value = (cat === 'All' ? '' : cat === 'Furniture' || cat === 'Appliances' ? cat : '');
  filterProducts();
}

function filterProducts() {
  const query  = (document.getElementById('browseSearch')?.value || '').toLowerCase();
  const cat    = document.getElementById('catFilter')?.value || '';
  const sort   = document.getElementById('sortFilter')?.value || 'default';

  let list = DB.products.filter(p => {
    const matchQ   = !query || p.name.toLowerCase().includes(query) || p.type.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    const matchCat = !cat   || p.category === cat || p.type.toLowerCase().includes(cat.toLowerCase());
    return matchQ && matchCat;
  });

  if (sort === 'price-asc')  list = list.sort((a, b) => a.rent - b.rent);
  if (sort === 'price-desc') list = list.sort((a, b) => b.rent - a.rent);
  if (sort === 'rating')     list = list.sort((a, b) => b.rating - a.rating);

  renderBrowseGrid(list);
}


/* ─────────────────────────────────────────────
   7. PRODUCT DETAIL MODAL
───────────────────────────────────────────── */

function openProductModal(id) {
  const p = DB.products.find(x => x.id === id);
  if (!p) return;
  const tenure = DB.selectedTenures[id] || p.tenure[0];
  const totalCost = (p.rent * tenure) + p.deposit;
  const inCart = DB.cart.find(c => c.id === id);

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-emoji">${p.emoji}</div>
    <h2>${p.name}</h2>
    <div class="modal-cat">${p.category} · ${p.type}</div>
    <div style="font-size:0.85rem;color:var(--text2);margin-bottom:14px;line-height:1.6">${p.description}</div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
      <span style="color:var(--gold);font-size:1rem">★★★★★</span>
      <span style="font-size:0.85rem;color:var(--text2)">${p.rating} · ${p.reviews} reviews</span>
      <span style="margin-left:auto;font-size:0.8rem;color:var(--accent3)">📦 ${p.stock} in stock</span>
    </div>
    <div class="modal-grid">
      <div class="modal-stat"><div class="modal-stat-lbl">Monthly Rent</div><div class="modal-stat-val accent">₹${p.rent.toLocaleString()}</div></div>
      <div class="modal-stat"><div class="modal-stat-lbl">Security Deposit</div><div class="modal-stat-val">₹${p.deposit.toLocaleString()}</div></div>
      <div class="modal-stat"><div class="modal-stat-lbl">Total for ${tenure} mo</div><div class="modal-stat-val accent">₹${totalCost.toLocaleString()}</div></div>
      <div class="modal-stat"><div class="modal-stat-lbl">Delivery</div><div class="modal-stat-val green">Free 🎁</div></div>
    </div>
    <div class="tenure-wrap">
      <label>Select Rental Tenure</label>
      <div class="tenure-pills">
        ${DB.products.find(prod => prod.id === p.id).tenure.map(t => `
<button class="t-btn ${t === p.tenure ? 'active' : ''}"
onclick="updateCartTenure(${p.id}, ${t})">
${t}mo
</button>
`).join('')}
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn-grad" onclick="addToCartFromModal(${id})">${inCart ? '✓ In Cart – View Cart' : 'Add to Cart 🛒'}</button>
      <button class="btn-ghost" onclick="closeModal('productModal')">Close</button>
    </div>`;

  openModal('productModal');
}

function selectModalTenure(pid, tenure, el) {
  DB.selectedTenures[pid] = tenure;
  el.closest('.tenure-pills').querySelectorAll('.t-pill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  // Refresh total display
  const p = DB.products.find(x => x.id === pid);
  const totalEl = el.closest('.modal').querySelector('.modal-stat-val.accent');
  if (totalEl) totalEl.textContent = '₹' + ((p.rent * tenure) + p.deposit).toLocaleString();
  // Update "Total for X mo" label
  const allStats = el.closest('.modal').querySelectorAll('.modal-stat');
  if (allStats[2]) allStats[2].querySelector('.modal-stat-lbl').textContent = `Total for ${tenure} mo`;
}

function addToCartFromModal(id) {
  const inCart = DB.cart.find(c => c.id === id);
  if (inCart) { closeModal('productModal'); showUserPage('cart'); return; }
  addToCart(id);
  closeModal('productModal');
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Close modals on overlay click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ─────────────────────────────────────────────
   8. CART
───────────────────────────────────────────── */

function quickAddCart(id) {
  const inCart = DB.cart.find(c => c.id === id);
  if (inCart) { showUserPage('cart'); return; }
  addToCart(id);
}

function addToCart(id) {
  const p = DB.products.find(x => x.id === id);
  if (!p) return;
  if (DB.cart.find(c => c.id === id)) {
    showToast('Already in cart!', '🛒'); return;
  }
 const selectedTenure = DB.selectedTenures[id] || p.tenure[0];

DB.cart.push({
  ...p,
  tenureOptions: [...p.tenure],
  selectedTenure
});
  updateCartBadge();
  showToast(`${p.name} added to cart!`, '🛒');
  // Refresh grids so button states update
  renderFeaturedGrid();
  renderBrowseGrid();
}

function removeFromCart(id) {
  DB.cart = DB.cart.filter(c => c.id !== id);
  updateCartBadge();
  renderCart();
  renderCheckout();
  renderFeaturedGrid();
  renderBrowseGrid();
  showToast('Item removed from cart', '🗑️');
}

function updateCartTenure(id, tenure) {
  const item = DB.cart.find(c => c.id === id);
  if (item) { item.tenure = parseInt(tenure); renderCart(); renderCheckout(); }
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = DB.cart.length;
}

function getCartTotals() {
  const rentTotal    = DB.cart.reduce((s, p) => s + (p.rent * p.tenure), 0);
  const depositTotal = DB.cart.reduce((s, p) => s + p.deposit, 0);
  const delivery     = 0;
  const total        = rentTotal + depositTotal + delivery;
  return { rentTotal, depositTotal, delivery, total };
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const summaryEl = document.getElementById('summaryLines');
  const totalEl   = document.getElementById('cartTotal');
  if (!container) return;

  if (DB.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty glass-card">
        <div class="empty-icon">🛒</div>
        <h3 style="margin-bottom:8px;font-family:var(--ff-display)">Your cart is empty</h3>
        <p style="color:var(--text2);margin-bottom:20px">Explore our catalog and add items to get started.</p>
        <button class="btn-grad" onclick="showUserPage('browse')">Browse Products</button>
      </div>`;
    if (summaryEl) summaryEl.innerHTML = '<div class="summary-line"><span>Items</span><span>0</span></div>';
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  container.innerHTML = DB.cart.map(p => `
    <div class="cart-item">
      <div class="cart-emoji">${p.emoji}</div>
      <div class="cart-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-cat">${p.category} · ${p.type}</div>
        <div class="cart-tenure-select">
          <span>Tenure:</span>
          <div class="tenure-btns">
            ${p.tenure.map(t => `<button class="t-btn ${t === p.tenure_selected || t === p.tenure ? 'active' : ''}" onclick="updateCartTenure(${p.id}, ${t})">${t}mo</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="cart-price">
        <div class="cart-price-main">₹${(p.rent * p.tenure).toLocaleString()}</div>
        <div class="cart-price-dep">+₹${p.deposit.toLocaleString()} deposit</div>
        <div style="font-size:0.72rem;color:var(--text3);margin-top:2px">₹${p.rent}/mo × ${p.tenure} mo</div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${p.id})" title="Remove">✕</button>
    </div>`).join('');

  const { rentTotal, depositTotal, delivery, total } = getCartTotals();

  if (summaryEl) summaryEl.innerHTML = `
    <div class="summary-line"><span>Rent (all items)</span><span>₹${rentTotal.toLocaleString()}</span></div>
    <div class="summary-line"><span>Security Deposits</span><span>₹${depositTotal.toLocaleString()}</span></div>
    <div class="summary-line"><span>Delivery</span><span style="color:var(--accent3)">Free</span></div>`;

  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString();
}


/* ─────────────────────────────────────────────
   9. CHECKOUT
───────────────────────────────────────────── */

function renderCheckout() {
  const itemsEl   = document.getElementById('checkoutItems');
  const summaryEl = document.getElementById('checkoutSummary');
  const totalEl   = document.getElementById('checkoutTotal');
  if (!itemsEl) return;

  if (DB.cart.length === 0) {
    itemsEl.innerHTML = `<p style="color:var(--text2);text-align:center;padding:20px">No items. <a class="link-accent" onclick="showUserPage('browse')">Browse products</a></p>`;
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  itemsEl.innerHTML = DB.cart.map(p => `
    <div class="checkout-item">
      <span class="checkout-item-emoji">${p.emoji}</span>
      <div class="checkout-item-info">
        <div class="checkout-item-name">${p.name}</div>
        <div class="checkout-item-tenure">${p.tenure} months · ₹${p.rent}/mo</div>
      </div>
      <span class="checkout-item-price">₹${(p.rent * p.tenure + p.deposit).toLocaleString()}</span>
    </div>`).join('');

  const { rentTotal, depositTotal, total } = getCartTotals();
  if (summaryEl) summaryEl.innerHTML = `
    <div class="summary-line"><span>Rent Total</span><span>₹${rentTotal.toLocaleString()}</span></div>
    <div class="summary-line"><span>Deposits</span><span>₹${depositTotal.toLocaleString()}</span></div>
    <div class="summary-line"><span>Delivery</span><span style="color:var(--accent3)">₹0 Free</span></div>`;

  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString();

  // Set min date for delivery
  const dateInput = document.getElementById('deliveryDate');
  if (dateInput) {
    const minDate = new Date(); minDate.setDate(minDate.getDate() + 2);
    dateInput.min = minDate.toISOString().split('T')[0];
    dateInput.value = minDate.toISOString().split('T')[0];
  }
}

function placeOrder() {
  if (DB.cart.length === 0) { showToast('Your cart is empty!', '⚠️'); return; }
  // Add to active rentals simulation
  DB.cart.forEach(p => {
    const start = new Date(); start.setDate(start.getDate() + 2);
    const end   = new Date(start); end.setMonth(end.getMonth() + p.tenure);
    DB.activeRentals.unshift({
      id: 'ORD' + Math.floor(Math.random() * 9000 + 1000),
      productId: p.id, productName: p.name,
      emoji: p.emoji, tenure: p.tenure,
      start: start.toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}),
      end:   end.toLocaleDateString('en-IN',   {day:'2-digit', month:'short', year:'numeric'}),
      amount: p.rent * p.tenure + p.deposit,
      status: 'upcoming', progress: 0, city: 'Bangalore',
    });
  });
  DB.cart = [];
  updateCartBadge();
  renderRentals();
  renderFeaturedGrid();
  renderBrowseGrid();
  showToast('🎉 Order placed! Delivery in 2-3 days.', '✅');
  setTimeout(() => showUserPage('rentals'), 1200);
}


/* ─────────────────────────────────────────────
   10. ACTIVE RENTALS
───────────────────────────────────────────── */

function renderRentals(filter = 'all') {
  const grid = document.getElementById('rentalGrid');
  if (!grid) return;

  const list = filter === 'all' ? DB.activeRentals
    : DB.activeRentals.filter(r => r.status === filter || (filter === 'ending' && r.progress > 70));

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text2)"><div style="font-size:3rem">📦</div><p style="margin-top:12px">No rentals here yet.</p><button class="btn-grad" style="margin-top:16px" onclick="showUserPage('browse')">Start Renting</button></div>`;
    return;
  }

  grid.innerHTML = list.map(r => `
    <div class="rental-card">
      <div class="rental-header">
        <div class="rental-emoji">${r.emoji}</div>
        <div>
          <div class="rental-name">${r.productName}</div>
          <div class="rental-id">#${r.id}</div>
        </div>
        <span class="status-badge status-${r.status}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
      </div>
      <div class="rental-details">
        <div class="rental-detail-item"><div class="rdl">Start Date</div><div class="rdv">${r.start}</div></div>
        <div class="rental-detail-item"><div class="rdl">End Date</div><div class="rdv">${r.end}</div></div>
        <div class="rental-detail-item"><div class="rdl">Tenure</div><div class="rdv">${r.tenure} Months</div></div>
        <div class="rental-detail-item"><div class="rdl">Total Paid</div><div class="rdv" style="background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700">₹${r.amount.toLocaleString()}</div></div>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${r.progress}%"></div></div>
      <div style="font-size:0.72rem;color:var(--text3);margin-bottom:12px;display:flex;justify-content:space-between">
        <span>${r.progress}% elapsed</span><span>${100 - r.progress}% remaining</span>
      </div>
      <div class="rental-actions">
        <button class="btn-ghost small" onclick="showToast('Extension request sent!','📅')">Extend</button>
        <button class="btn-ghost small" onclick="showUserPage('maintenance')">🔧 Support</button>
        <button class="btn-ghost small" onclick="showToast('Pickup scheduled!','📦')">Return</button>
      </div>
    </div>`).join('');
}

function filterRentals(type, el) {
  document.querySelectorAll('#upage-rentals .pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const map = { active:'active', upcoming:'upcoming', ending:'ending' };
  renderRentals(map[type] || 'all');
}


/* ─────────────────────────────────────────────
   11. RENTAL HISTORY
───────────────────────────────────────────── */

function renderHistory() {
  const tbody = document.getElementById('historyBody');
  if (!tbody) return;
  tbody.innerHTML = DB.rentalHistory.map(h => `
    <tr>
      <td><span style="font-family:var(--ff-display);color:var(--accent)">#${h.id}</span></td>
      <td><span style="margin-right:8px">${h.emoji}</span>${h.product}</td>
      <td>${h.tenure}</td>
      <td>${h.start}</td>
      <td>${h.end}</td>
      <td style="font-weight:600">${h.amount}</td>
      <td><span class="status-badge status-${h.status}">${h.status}</span></td>
    </tr>`).join('');
}


/* ─────────────────────────────────────────────
   12. MAINTENANCE
───────────────────────────────────────────── */

function submitMaintenance() {
  const product = document.getElementById('maintProduct').value;
  const newReq = {
    id: 'MNT' + String(DB.maintenanceHistory.length + 1).padStart(3, '0'),
    product,
    issue: 'New issue reported',
    date:  new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}),
    status: 'pending',
    priority: 'medium',
  };
  DB.maintenanceHistory.unshift(newReq);
  renderMaintenanceHistory();
  showToast('Maintenance request submitted!', '🔧');
}

function renderMaintenanceHistory() {
  const el = document.getElementById('maintHistory');
  if (!el) return;
  const statusColor = { resolved:'status-active', 'in-progress':'status-upcoming', pending:'status-pending' };
  el.innerHTML = DB.maintenanceHistory.map(m => `
    <div class="maint-item">
      <div class="maint-icon">🔧</div>
      <div class="maint-info">
        <div class="maint-product">${m.product}</div>
        <div class="maint-issue">${m.issue}</div>
        <div class="maint-meta">
          <span class="status-badge ${statusColor[m.status] || 'status-pending'}">${m.status}</span>
          <span class="maint-date">${m.date}</span>
          <span style="font-size:0.72rem;color:var(--text3);margin-left:auto">#${m.id}</span>
        </div>
      </div>
    </div>`).join('');
}


/* ─────────────────────────────────────────────
   13. ADMIN — KPI
───────────────────────────────────────────── */

function renderKPI() {
  const kpis = [
    { icon:'📦', val:'247',     label:'Active Rentals',   change:'+12% this month',   up:true },
    { icon:'💰', val:'₹4.2L',   label:'Monthly Revenue',  change:'+18% vs last month', up:true },
    { icon:'👥', val:'5,248',   label:'Total Users',      change:'+85 new this week',  up:true },
    { icon:'🔄', val:'94.2%',   label:'Utilization Rate', change:'-1.2% this week',   up:false },
    { icon:'⚡', val:'8.4 hrs', label:'Avg Resolution',   change:'-2hrs improved',     up:true },
    { icon:'⭐', val:'4.87',    label:'Avg Rating',       change:'+0.02 this month',   up:true },
  ];
  document.getElementById('kpiGrid').innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-val">${k.val}</div>
      <div class="kpi-lbl">${k.label}</div>
      <div class="kpi-change ${k.up ? 'kpi-up' : 'kpi-down'}">${k.up ? '↑' : '↓'} ${k.change}</div>
    </div>`).join('');
}


/* ─────────────────────────────────────────────
   14. ADMIN — RECENT ORDERS
───────────────────────────────────────────── */

function renderRecentOrders() {
  const table = document.getElementById('recentOrders');
  if (!table) return;
  const recent = DB.adminRentals.slice(0, 5);
  table.innerHTML = `
    <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>
      ${recent.map(r => `
        <tr>
          <td><span style="color:var(--accent);font-family:var(--ff-display)">#${r.id}</span></td>
          <td>${r.customer}</td>
          <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.product}</td>
          <td style="font-weight:600">${r.amount}</td>
          <td><span class="status-badge status-${r.status}">${r.status}</span></td>
        </tr>`).join('')}
    </tbody>`;
}


/* ─────────────────────────────────────────────
   15. ADMIN — INVENTORY ALERTS
───────────────────────────────────────────── */

function renderInventoryAlerts() {
  const el = document.getElementById('inventoryAlerts');
  if (!el) return;
  const lowStock = DB.products.filter(p => p.stock <= 6);
  el.innerHTML = lowStock.map(p => `
    <div class="alert-item">
      <span class="alert-icon">⚠️</span>
      <span>${p.emoji} ${p.name} — only <strong>${p.stock}</strong> left</span>
    </div>`).join('') || '<p style="color:var(--accent3);font-size:0.85rem">✅ All items well-stocked</p>';
}


/* ─────────────────────────────────────────────
   16. ADMIN — USERS TABLE
───────────────────────────────────────────── */

function renderUsersTable(list) {
  const tbody = document.getElementById('usersBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(u => `
    <tr>
      <td><span style="color:var(--accent);font-family:var(--ff-display)">${u.id}</span></td>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="avatar-sm" style="width:28px;height:28px;font-size:0.7rem">${u.name.split(' ').map(n=>n[0]).join('')}</div>${u.name}</div></td>
      <td style="color:var(--text2)">${u.email}</td>
      <td>${u.city}</td>
      <td style="text-align:center"><span style="background:rgba(108,99,255,0.2);padding:3px 10px;border-radius:20px;font-size:0.8rem">${u.rentals}</span></td>
      <td><span class="status-badge ${u.status === 'active' ? 'status-active' : 'status-completed'}">${u.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-xs primary" onclick="showToast('Viewing ${u.name}…','👤')">View</button>
          <button class="btn-xs" onclick="showToast('Editing ${u.name}…','✏️')">Edit</button>
          <button class="btn-xs danger" onclick="showToast('User ${u.id} suspended','⛔')">Suspend</button>
        </div>
      </td>
    </tr>`).join('');
}

function searchUsers(query) {
  const q = query.toLowerCase();
  const filtered = DB.users.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.city.toLowerCase().includes(q)
  );
  renderUsersTable(filtered);
}


/* ─────────────────────────────────────────────
   17. ADMIN — INVENTORY TABLE
───────────────────────────────────────────── */

function renderInventoryTable(list) {
  const tbody = document.getElementById('inventoryBody');
  if (!tbody) return;
  const statusMap = p => {
    if (p.stock === 0) return ['status-completed', 'Out of Stock'];
    if (p.stock <= 5)  return ['status-pending', 'Low Stock'];
    return ['status-active', 'Available'];
  };
  tbody.innerHTML = list.map(p => {
    const [cls, label] = statusMap(p);
    return `
    <tr>
      <td><span style="color:var(--accent);font-family:var(--ff-display)">PRD${String(p.id).padStart(3,'0')}</span></td>
      <td><div style="display:flex;align-items:center;gap:8px"><span style="font-size:1.4rem">${p.emoji}</span><div><div style="font-weight:500">${p.name}</div><div style="font-size:0.72rem;color:var(--text3)">${p.type}</div></div></div></td>
      <td>${p.category}</td>
      <td style="font-weight:600;color:var(--accent)">₹${p.rent.toLocaleString()}</td>
      <td style="color:var(--text2)">₹${p.deposit.toLocaleString()}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;width:60px">
            <div style="height:100%;background:var(--grad);width:${Math.min(100,(p.stock/15)*100)}%;border-radius:3px"></div>
          </div>
          <span style="font-size:0.8rem;font-weight:600">${p.stock}</span>
        </div>
      </td>
      <td><span class="status-badge ${cls}">${label}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-xs primary" onclick="showToast('Editing ${p.name}','✏️')">Edit</button>
          <button class="btn-xs" onclick="showToast('Stock updated for ${p.name}','📦')">+Stock</button>
          <button class="btn-xs danger" onclick="showToast('${p.name} deactivated','❌')">Remove</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function openAddProduct() {
  openModal('addProductModal');
}


/* ─────────────────────────────────────────────
   18. ADMIN — RENTALS MONITORING
───────────────────────────────────────────── */

function renderAdminRentals(list) {
  const tbody = document.getElementById('adminRentalsBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(r => `
    <tr>
      <td><span style="color:var(--accent);font-family:var(--ff-display)">#${r.id}</span></td>
      <td>${r.customer}</td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.product}</td>
      <td>${r.tenure}</td>
      <td style="font-weight:600">${r.amount}</td>
      <td style="font-size:0.82rem;color:var(--text2)">${r.delivery}</td>
      <td><span class="status-badge status-${r.status}">${r.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-xs primary" onclick="showToast('Viewing order #${r.id}','📋')">View</button>
          <button class="btn-xs" onclick="showToast('Order #${r.id} updated','✅')">Update</button>
          ${r.status !== 'completed' ? `<button class="btn-xs danger" onclick="markOrderComplete('${r.id}')">Complete</button>` : ''}
        </div>
      </td>
    </tr>`).join('');
}

function markOrderComplete(id) {
  const order = DB.adminRentals.find(r => r.id === id);
  if (order) { order.status = 'completed'; renderAdminRentals(DB.adminRentals); }
  showToast(`Order #${id} marked complete`, '✅');
}

function filterAdminRentals(type, el) {
  document.querySelectorAll('#apage-rentals-admin .pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const list = type === 'all' ? DB.adminRentals : DB.adminRentals.filter(r => r.status === type);
  renderAdminRentals(list);
}


/* ─────────────────────────────────────────────
   19. ADMIN — DAMAGE CLAIMS
───────────────────────────────────────────── */

function renderClaims() {
  const grid = document.getElementById('claimsGrid');
  if (!grid) return;
  const statusColor = { pending:'status-pending', resolved:'status-active', 'in-progress':'status-upcoming' };
  grid.innerHTML = DB.damageClaims.map(c => `
    <div class="claim-card">
      <div class="claim-header">
        <div class="claim-emoji">${c.emoji}</div>
        <div>
          <div class="claim-product">${c.product}</div>
          <div class="claim-id">#${c.id} · ${c.customer}</div>
        </div>
        <span class="status-badge ${statusColor[c.status]}" style="margin-left:auto">${c.status}</span>
      </div>
      <div class="claim-desc">${c.desc}</div>
      <div class="claim-meta">
        <div>
          <div style="font-size:0.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em">Est. Damage Cost</div>
          <div class="claim-amt">${c.amount}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.68rem;color:var(--text3)">Filed</div>
          <div style="font-size:0.82rem;color:var(--text2)">${c.date}</div>
        </div>
      </div>
      <div class="claim-actions">
        ${c.status === 'pending' ? `
          <button class="btn-xs primary" onclick="resolveClaim('${c.id}')">✓ Resolve</button>
          <button class="btn-xs" onclick="showToast('Claim ${c.id} under review','🔎')">Investigate</button>
          <button class="btn-xs danger" onclick="showToast('Claim ${c.id} rejected','❌')">Reject</button>
        ` : c.status === 'in-progress' ? `
          <button class="btn-xs primary" onclick="resolveClaim('${c.id}')">Mark Resolved</button>
        ` : `
          <button class="btn-xs" onclick="showToast('Claim #${c.id} — Resolved','✅')">View Details</button>
        `}
      </div>
    </div>`).join('');
}

function resolveClaim(id) {
  const claim = DB.damageClaims.find(c => c.id === id);
  if (claim) { claim.status = 'resolved'; renderClaims(); }
  showToast(`Claim #${id} resolved`, '✅');
}


/* ─────────────────────────────────────────────
   20. ADMIN — ANALYTICS
───────────────────────────────────────────── */

function renderAnalytics() {
  // Analytics KPIs
  const kpis = [
    { icon:'💰', val:'₹28.4L',  label:'Total Revenue (YTD)',    change:'+22% vs last year', up:true },
    { icon:'📦', val:'1,842',   label:'Total Orders (YTD)',     change:'+340 vs last year', up:true },
    { icon:'🔄', val:'82.4%',   label:'Customer Retention',     change:'+4.2% improvement', up:true },
    { icon:'⏱️', val:'2.3 days', label:'Avg Delivery Time',      change:'-0.4 days faster',  up:true },
  ];
  const analyticsKpi = document.getElementById('analyticsKpi');
  if (analyticsKpi) analyticsKpi.innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-val">${k.val}</div>
      <div class="kpi-lbl">${k.label}</div>
      <div class="kpi-change ${k.up ? 'kpi-up' : 'kpi-down'}">${k.up ? '↑' : '↓'} ${k.change}</div>
    </div>`).join('');

  // Revenue bar chart
  const months = [
    { label:'Jan', val:380000, pct:60 },
    { label:'Feb', val:420000, pct:66 },
    { label:'Mar', val:510000, pct:80 },
    { label:'Apr', val:480000, pct:75 },
    { label:'May', val:560000, pct:88 },
    { label:'Jun', val:640000, pct:100 },
  ];
  const revChart = document.getElementById('revenueChart');
  if (revChart) revChart.innerHTML = `
    <div class="bar-chart">
      ${months.map(m => `
        <div class="bar-col">
          <div class="bar-val">₹${(m.val/100000).toFixed(1)}L</div>
          <div class="bar" style="height:${m.pct}%"></div>
          <div class="bar-lbl">${m.label}</div>
        </div>`).join('')}
    </div>`;

  // Category donut
  const cats = [
    { label:'Furniture',         pct:44, color:'#6C63FF' },
    { label:'Appliances',        pct:38, color:'#FF6B6B' },
    { label:'Combo Packages',    pct:12, color:'#43E97B' },
    { label:'Office Equipment',  pct:6,  color:'#FFD700' },
  ];
  const catChart = document.getElementById('categoryChart');
  if (catChart) catChart.innerHTML = cats.map(c => `
    <div class="donut-row">
      <div class="donut-dot" style="background:${c.color}"></div>
      <span class="donut-label">${c.label}</span>
      <div class="donut-bar-bg">
        <div class="donut-bar-fill" style="width:${c.pct}%;background:${c.color}"></div>
      </div>
      <span class="donut-pct" style="color:${c.color}">${c.pct}%</span>
    </div>`).join('');

  // Top products
  const tops = [
    { emoji:'🛏️', name:'Nordic King Bed',     rentals:284, revenue:'₹3.7L' },
    { emoji:'❄️', name:'Samsung Fridge 320L',  rentals:261, revenue:'₹3.2L' },
    { emoji:'🌡️', name:'Daikin 1.5T AC',       rentals:198, revenue:'₹2.9L' },
    { emoji:'🛋️', name:'Sectional Sofa',        rentals:176, revenue:'₹2.1L' },
    { emoji:'📺', name:'Sony Bravia 55"',       rentals:155, revenue:'₹1.9L' },
  ];
  const topEl = document.getElementById('topProducts');
  if (topEl) topEl.innerHTML = tops.map((p, i) => `
    <div class="top-product">
      <div class="top-rank">${String(i+1).padStart(2,'0')}</div>
      <div class="top-emoji">${p.emoji}</div>
      <div class="top-info">
        <div class="top-name">${p.name}</div>
        <div class="top-rentals">${p.rentals} rentals</div>
      </div>
      <div class="top-revenue">${p.revenue}</div>
    </div>`).join('');

  // City stats
  const cities = [
    { name:'Delhi NCR',  rentals:2890, pct:100 },
    { name:'Mumbai',     rentals:2310, pct:80  },
    { name:'Bangalore',  rentals:1842, pct:64  },
    { name:'Hyderabad',  rentals:980,  pct:34  },
    { name:'Chennai',    rentals:756,  pct:26  },
    { name:'Pune',       rentals:640,  pct:22  },
  ];
  const cityEl = document.getElementById('cityStats');
  if (cityEl) cityEl.innerHTML = cities.map(c => `
    <div class="city-row">
      <span class="city-name">📍 ${c.name}</span>
      <div class="city-bar-bg"><div class="city-bar-fill" style="width:${c.pct}%"></div></div>
      <span class="city-val">${c.rentals.toLocaleString()}</span>
    </div>`).join('');
}


/* ─────────────────────────────────────────────
   21. ADMIN — SERVICE AREAS
───────────────────────────────────────────── */

function renderServiceAreas() {
  const grid = document.getElementById('areasGrid');
  if (!grid) return;
  const statusStyle = {
    active:  { badge:'status-active',   icon:'✅' },
    limited: { badge:'status-pending',  icon:'⚠️' },
    coming:  { badge:'status-completed', icon:'🔜' },
  };
  grid.innerHTML = DB.serviceAreas.map(a => {
    const s = statusStyle[a.status] || statusStyle.limited;
    return `
    <div class="area-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="area-city">${a.city}</div>
          <div class="area-state">${a.state}</div>
        </div>
        <span class="status-badge ${s.badge}">${s.icon} ${a.status}</span>
      </div>
      <div class="area-stats">
        <div class="area-stat-item">
          <div class="area-stat-lbl">Warehouses</div>
          <div class="area-stat-val">${a.warehouses}</div>
        </div>
        <div class="area-stat-item">
          <div class="area-stat-lbl">Active Rentals</div>
          <div class="area-stat-val">${a.activeRentals.toLocaleString()}</div>
        </div>
        <div class="area-stat-item">
          <div class="area-stat-lbl">Delivery</div>
          <div class="area-stat-val">${a.deliveryDays} days</div>
        </div>
        <div class="area-stat-item">
          <div class="area-stat-lbl">Coverage</div>
          <div class="area-stat-val" style="color:${a.status==='active'?'var(--accent3)':'var(--gold)'}">${a.coverage}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-xs primary" onclick="showToast('Managing ${a.city}…','🗺️')">Manage</button>
        ${a.status === 'active' ? `<button class="btn-xs" onclick="showToast('${a.city} analytics loaded','📊')">Analytics</button>` : ''}
        ${a.status === 'coming' ? `<button class="btn-xs" onclick="showToast('${a.city} launch scheduled!','🚀')">Schedule Launch</button>` : ''}
      </div>
    </div>`;
  }).join('');
}


/* ─────────────────────────────────────────────
   22. TOAST NOTIFICATIONS
───────────────────────────────────────────── */

let _toastTimer = null;

function showToast(msg, icon = '✅') {
  const toast   = document.getElementById('toast');
  const msgEl   = document.getElementById('toastMsg');
  const iconEl  = document.getElementById('toastIcon');
  if (!toast) return;
  msgEl.textContent  = msg;
  iconEl.textContent = icon;
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}


/* ─────────────────────────────────────────────
   23. KEYBOARD SHORTCUTS
───────────────────────────────────────────── */

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
    // Close sidebars on mobile
    document.getElementById('userSidebar')?.classList.remove('open');
    document.getElementById('adminSidebar')?.classList.remove('open');
  }
});


/* ─────────────────────────────────────────────
   24. INIT
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function() {
  // Demo: Auto-fill login for convenience
  const emailInput = document.getElementById('login-email');
  const passInput  = document.getElementById('login-password');
  if (emailInput) emailInput.placeholder = 'any@email.com (any creds)';
  if (passInput)  passInput.placeholder  = 'any password';

  showToast('Welcome to RentEase! Sign in to continue.', '🏠');
});