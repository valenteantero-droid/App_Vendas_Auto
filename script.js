// ===============================
// CONFIGURAÇÕES DA LOJA
// Altere somente este bloco para personalizar o site.
// ===============================
const STORE = {
  name: 'AutoPrime Peças',
  whatsapp: '5521999999999', // somente números: 55 + DDD + telefone
  phoneLabel: '(21) 99999-9999',
  address: 'Rua Exemplo, 123 - Centro, Rio de Janeiro - RJ',
  hours: 'Seg a Sex: 08h às 18h • Sáb: 08h às 13h',
  pixKey: 'pix@autoprime.com.br'
};

const PRODUCTS = [
  { id: 1, name: 'Pastilha de Freio Dianteira', category: 'Freios', brand: 'Cobreq', code: 'N-1234', price: 129.90, emoji: '🛞', desc: 'Jogo de pastilhas para eixo dianteiro. Consulte aplicação.' },
  { id: 2, name: 'Filtro de Óleo', category: 'Filtros', brand: 'Tecfil', code: 'PSL-55', price: 39.90, emoji: '🧰', desc: 'Filtro de óleo do motor. Confirme o modelo do veículo.' },
  { id: 3, name: 'Kit Correia Dentada', category: 'Motor', brand: 'Gates', code: 'KTB-778', price: 289.90, emoji: '⚙️', desc: 'Kit com correia e tensionador. Aplicação sob consulta.' },
  { id: 4, name: 'Amortecedor Dianteiro', category: 'Suspensão', brand: 'Cofap', code: 'GP-33211', price: 349.90, emoji: '🔩', desc: 'Amortecedor dianteiro unidade. Consulte lado e aplicação.' },
  { id: 5, name: 'Vela de Ignição', category: 'Ignição', brand: 'NGK', code: 'BKR6E', price: 34.90, emoji: '⚡', desc: 'Vela de ignição unitária. Verifique código correto.' },
  { id: 6, name: 'Filtro de Ar do Motor', category: 'Filtros', brand: 'Mahle', code: 'LX-2045', price: 59.90, emoji: '🌬️', desc: 'Elemento filtrante do motor. Consulte aplicação.' },
  { id: 7, name: 'Bomba de Combustível', category: 'Injeção', brand: 'Bosch', code: 'F000TE123', price: 419.90, emoji: '⛽', desc: 'Bomba elétrica de combustível. Aplicação sob consulta.' },
  { id: 8, name: 'Disco de Freio Dianteiro', category: 'Freios', brand: 'Fremax', code: 'BD-1044', price: 219.90, emoji: '⭕', desc: 'Disco de freio ventilado. Valor por unidade.' }
];

let cart = JSON.parse(localStorage.getItem('autoprime_cart') || '[]');

const $ = (s) => document.querySelector(s);
const money = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function applyStoreConfig() {
  $('#storeNameHeader').textContent = STORE.name;
  $('#storeNameFooter').textContent = STORE.name;
  $('#storeNameBottom').textContent = STORE.name;
  $('#storePhone').textContent = STORE.phoneLabel;
  $('#storeAddress').textContent = STORE.address;
  $('#storeHours').textContent = STORE.hours;
  $('#pixKey').textContent = STORE.pixKey;
  $('#currentYear').textContent = new Date().getFullYear();
}

function populateCategories() {
  const cats = [...new Set(PRODUCTS.map(p => p.category))].sort();
  cats.forEach(c => {
    const op = document.createElement('option');
    op.value = c; op.textContent = c;
    $('#categoryFilter').appendChild(op);
  });
}

function renderProducts() {
  const q = $('#searchInput').value.toLowerCase().trim();
  const cat = $('#categoryFilter').value;
  const list = PRODUCTS.filter(p => {
    const matchesText = `${p.name} ${p.brand} ${p.code} ${p.category}`.toLowerCase().includes(q);
    const matchesCat = cat === 'all' || p.category === cat;
    return matchesText && matchesCat;
  });

  $('#productGrid').innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image"><span>${p.emoji}</span><div class="stock-badge">CONSULTE ESTOQUE</div></div>
      <div class="product-body">
        <div class="product-category">${p.category} • ${p.brand}</div>
        <h3>${p.name}</h3>
        <div class="product-code">Código: ${p.code}</div>
        <p class="product-desc">${p.desc}</p>
        <div class="product-price">${money(p.price)}</div>
        <button class="btn btn-primary" onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
      </div>
    </article>`).join('');
  $('#emptyState').classList.toggle('hidden', list.length !== 0);
}

function saveCart() { localStorage.setItem('autoprime_cart', JSON.stringify(cart)); }
function cartTotal() { return cart.reduce((s,i) => s + i.price * i.qty, 0); }
function cartCount() { return cart.reduce((s,i) => s + i.qty, 0); }

window.addToCart = function(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const item = cart.find(x => x.id === id);
  item ? item.qty++ : cart.push({ ...p, qty: 1 });
  saveCart(); renderCart(); showToast('Produto adicionado ao carrinho');
};

window.changeQty = function(id, delta) {
  const item = cart.find(x => x.id === id); if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart(); renderCart();
};

window.removeItem = function(id) {
  cart = cart.filter(x => x.id !== id); saveCart(); renderCart();
};

function renderCart() {
  $('#cartCount').textContent = cartCount();
  $('#cartTotal').textContent = money(cartTotal());
  $('#cartEmpty').classList.toggle('hidden', cart.length > 0);
  $('#cartItems').innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-thumb">${i.emoji}</div>
      <div class="cart-info">
        <strong>${i.name}</strong><small>${money(i.price)} cada</small>
        <div class="qty-row"><button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button><b>${i.qty}</b><button class="qty-btn" onclick="changeQty(${i.id},1)">+</button><button class="remove-btn" onclick="removeItem(${i.id})">Remover</button></div>
      </div>
      <strong>${money(i.price*i.qty)}</strong>
    </div>`).join('');
  $('#checkoutBtn').disabled = cart.length === 0;
  $('#checkoutBtn').style.opacity = cart.length ? '1' : '.55';
}

function openCart() { $('#cartDrawer').classList.add('active'); $('#drawerOverlay').classList.add('active'); }
function closeCart() { $('#cartDrawer').classList.remove('active'); $('#drawerOverlay').classList.remove('active'); }
function openCheckout() {
  if (!cart.length) return;
  closeCart();
  $('#checkoutItems').innerHTML = cart.map(i => `<div class="summary-line"><span>${i.qty}x ${i.name}</span><strong>${money(i.price*i.qty)}</strong></div>`).join('');
  $('#checkoutTotal').textContent = money(cartTotal());
  $('#checkoutModal').classList.add('active'); $('#checkoutOverlay').classList.add('active');
}
function closeCheckout() { $('#checkoutModal').classList.remove('active'); $('#checkoutOverlay').classList.remove('active'); }

function whatsappUrl(message='Olá! Gostaria de falar sobre peças automotivas.') {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}

function showToast(text) {
  const t = $('#toast'); t.textContent = text; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

$('#searchInput').addEventListener('input', renderProducts);
$('#categoryFilter').addEventListener('change', renderProducts);
$('#openCartBtn').addEventListener('click', openCart);
$('#closeCartBtn').addEventListener('click', closeCart);
$('#drawerOverlay').addEventListener('click', closeCart);
$('#checkoutBtn').addEventListener('click', openCheckout);
$('#closeCheckoutBtn').addEventListener('click', closeCheckout);
$('#checkoutOverlay').addEventListener('click', closeCheckout);
$('#heroWhatsappBtn').addEventListener('click', () => window.open(whatsappUrl(), '_blank'));
$('#compatibilityBtn').addEventListener('click', () => window.open(whatsappUrl('Olá! Quero confirmar a compatibilidade de uma peça com meu veículo.'), '_blank'));

$('#copyPixBtn').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(STORE.pixKey); showToast('Chave Pix copiada'); }
  catch { showToast(`Chave Pix: ${STORE.pixKey}`); }
});

document.querySelectorAll('input[name="delivery"]').forEach(r => r.addEventListener('change', () => {
  $('#deliveryNote').classList.toggle('hidden', document.querySelector('input[name="delivery"]:checked').value !== 'Entrega a combinar');
}));

$('#checkoutForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!cart.length) return;
  const name = $('#customerName').value.trim();
  const phone = $('#customerPhone').value.trim();
  const vehicle = $('#customerVehicle').value.trim() || 'Não informado';
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const lines = cart.map(i => `• ${i.qty}x ${i.name} (${i.code}) — ${money(i.price*i.qty)}`).join('\n');
  const msg = `Olá! Quero fazer um pedido na ${STORE.name}.\n\n*Cliente:* ${name}\n*Telefone:* ${phone}\n*Veículo:* ${vehicle}\n*Recebimento:* ${delivery}\n\n*Itens:*\n${lines}\n\n*Total dos produtos:* ${money(cartTotal())}\n\n*Pagamento à distância:* Pix\n\nAguardo confirmação de estoque, aplicação e orientações para pagamento/retirada ou entrega.`;
  window.open(whatsappUrl(msg), '_blank');
});

applyStoreConfig(); populateCategories(); renderProducts(); renderCart();
