// Product Database mapped to your local image filenames
const products = [
  {
    id: 'p1',
    category: 'plaques',
    tag: 'Custom Shield Award',
    name: 'Player of the Match Shield',
    desc: 'Laser-cut custom shield plaque with custom plate engraving.',
    sizes: [
      { name: 'Standard (18cm)', price: 180 },
      { name: 'Large (25cm)', price: 260 }
    ],
    image: 'image_2.png' // Red & Black Shield Award
  },
  {
    id: 'p2',
    category: 'trophies',
    tag: 'Gold Column Trophy',
    name: 'Knysna Laurels Trophy',
    desc: 'Traditional gold column trophy with laurels topper and custom crest plate.',
    sizes: [
      { name: 'Medium (22cm)', price: 145 },
      { name: 'Tall (30cm)', price: 210 }
    ],
    image: 'image_3.png' // Gold Trophies Group
  },
  {
    id: 'p3',
    category: 'plaques',
    tag: 'Novelty Padel Trophy',
    name: 'Pringles Padel Champion Award',
    desc: 'Custom novelty padel trophy on solid weighted base.',
    sizes: [
      { name: 'Standard (20cm)', price: 220 },
      { name: 'Deluxe (28cm)', price: 340 }
    ],
    image: 'image_2.png'
  },
  {
    id: 'p4',
    category: 'medals',
    tag: 'Cast Metal Medallion',
    name: 'Moment of the Match Medal',
    desc: 'Heavyweight cast metal medallion with ribbon for sports events.',
    sizes: [
      { name: '50mm Standard', price: 45 },
      { name: '70mm Large', price: 65 }
    ],
    image: 'image_3.png'
  },
  {
    id: 'p5',
    category: 'stamps',
    tag: 'Self-Inking Stamp',
    name: 'Printy Custom Rubber Stamp',
    desc: 'Self-inking custom text stamp. Select ink color and type up to 20 characters.',
    isStamp: true,
    price: 165,
    colors: [
      { id: 'black', hex: '#111827', name: 'Black' },
      { id: 'red', hex: '#DC2626', name: 'Red' },
      { id: 'blue', hex: '#2563EB', name: 'Blue' }
    ],
    isGenericStamp: true // Uses dynamic generic stamp graphic instead of image file
  }
];

let cart = [];
let activeSection = 'all';
let selectedProduct = null;
let modalState = {};

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
});

// SECTION NAVIGATION CHOOSER
function switchSection(category, navBtn) {
  activeSection = category;
  document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
  navBtn.classList.add('active');

  const titles = {
    'all': 'All Products',
    'trophies': 'Trophies & Awards',
    'medals': 'Medals & Ribbons',
    'stamps': 'Self-Inking Rubber Stamps',
    'plaques': 'Acrylic Shields & Plaques'
  };

  document.getElementById('sectionTitle').innerText = titles[category] || 'Products';
  renderCatalog();
}

// RENDER PRODUCTS
function renderCatalog() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  const filtered = activeSection === 'all' 
    ? products 
    : products.filter(p => p.category === activeSection);

  filtered.forEach(p => {
    const minPrice = p.isStamp ? p.price : p.sizes[0].price;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => openProductModal(p.id);

    const imageHtml = p.isGenericStamp 
      ? `<div class="stamp-graphic"><span style="font-size: 2.5rem;">✒️</span><span>Self-Inking Stamp</span></div>`
      : `<img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200?text=Product+Image'">`;

    card.innerHTML = `
      <div class="product-image">
        ${imageHtml}
      </div>
      <div class="product-info">
        <span class="product-tag">${p.tag}</span>
        <div class="product-title">${p.name}</div>
        <div class="product-price">R${minPrice.toFixed(2)}</div>
        <div class="click-hint">Click to Customize & Select Options</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// OPEN MODAL FOR CLICKED ITEM
function openProductModal(productId) {
  selectedProduct = products.find(p => p.id === productId);
  
  if (selectedProduct.isStamp) {
    modalState = { color: 'black', colorHex: '#111827', text: '' };
  } else {
    modalState = { sizeIdx: 0 };
  }

  renderModalContent();
  document.getElementById('productModal').classList.add('open');
}

function closeProductModal(event) {
  if (!event || event.target.id === 'productModal' || event.target.className === 'close-modal') {
    document.getElementById('productModal').classList.remove('open');
  }
}

// RENDER MODAL INSIDE DETAILS
function renderModalContent() {
  const p = selectedProduct;
  const container = document.getElementById('modalBody');

  if (p.isStamp) {
    container.innerHTML = `
      <div class="modal-img-container">
        <div class="stamp-graphic" style="height: 100%; width: 100%;">
          <span style="font-size: 3rem;">✒️</span>
          <span>Press Ink Stamp</span>
        </div>
      </div>
      <div>
        <h2>${p.name}</h2>
        <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.5rem;">${p.desc}</p>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary);">R${p.price.toFixed(2)}</div>

        <div class="option-title">1. Select Ink Color</div>
        <div class="color-picker">
          ${p.colors.map(c => `
            <div class="color-option color-${c.id}${modalState.color === c.id ? 'selected' : ''}" 
                 onclick="setStampColor('${c.id}', '${c.hex}')"></div>
          `).join('')}
        </div>

        <div class="option-title">2. Enter Wording (Max 20 Chars)</div>
        <input type="text" maxlength="20" class="custom-text-input" 
               placeholder="e.g. RECEIVED" value="${modalState.text}"
               oninput="setStampText(this.value)">
        <div style="text-align: right; font-size: 0.75rem; color: var(--text-light);"><span id="charCount">${modalState.text.length}</span>/20</div>

        <div class="stamp-preview" id="stampPreview" style="color: ${modalState.colorHex}">
          ${modalState.text || 'YOUR TEXT HERE'}
        </div>

        <button class="add-btn" onclick="addModalItemToCart()">Add Custom Stamp to Cart</button>
      </div>
    `;
  } else {
    const currentPrice = p.sizes[modalState.sizeIdx].price;
    container.innerHTML = `
      <div class="modal-img-container">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200?text=Trophy'">
      </div>
      <div>
        <h2>${p.name}</h2>
        <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.5rem;">${p.desc}</p>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem;">
          R${currentPrice.toFixed(2)}
        </div>

        <div class="option-title">Select Size Option</div>
        <div class="size-selector">
          ${p.sizes.map((s, idx) => `
            <button class="size-btn ${idx === modalState.sizeIdx ? 'selected' : ''}" 
                    onclick="setModalSize(${idx})">${s.name}</button>
          `).join('')}
        </div>

        <button class="add-btn" onclick="addModalItemToCart()">Add to Cart</button>
      </div>
    `;
  }
}

function setModalSize(idx) {
  modalState.sizeIdx = idx;
  renderModalContent();
}

function setStampColor(colorId, colorHex) {
  modalState.color = colorId;
  modalState.colorHex = colorHex;
  renderModalContent();
}

function setStampText(text) {
  modalState.text = text;
  document.getElementById('charCount').innerText = text.length;
  document.getElementById('stampPreview').innerText = text || 'YOUR TEXT HERE';
}

// CART ACTIONS
function addModalItemToCart() {
  const p = selectedProduct;

  if (p.isStamp) {
    if (!modalState.text.trim()) {
      alert('Please enter text for your custom stamp.');
      return;
    }
    cart.push({
      cartId: Date.now(),
      name: p.name,
      details: `Color: ${modalState.color.toUpperCase()} | Text: "${modalState.text}"`,
      price: p.price
    });
  } else {
    const sizeObj = p.sizes[modalState.sizeIdx];
    cart.push({
      cartId: Date.now(),
      name: p.name,
      details: `Size: ${sizeObj.name}`,
      price: sizeObj.price
    });
  }

  updateCart();
  closeProductModal();
  toggleCart(true);
}

function updateCart() {
  document.getElementById('cartCount').innerText = cart.length;
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-light); margin-top: 2rem;">Your cart is empty.</p>`;
    cartTotal.innerText = 'R0.00';
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map(item => {
    total += item.price;
    return `
      <div class="cart-item">
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-sub">${item.details}</div>
          <div class="cart-item-price">R${item.price.toFixed(2)}</div>
        </div>
        <button class="remove-item" onclick="removeCartItem(${item.cartId})">Remove</button>
      </div>
    `;
  }).join('');

  cartTotal.innerText = `R${total.toFixed(2)}`;
}

function removeCartItem(cartId) {
  cart = cart.filter(item => item.cartId !== cartId);
  updateCart();
}

function toggleCart(forceOpen = false) {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (forceOpen || !drawer.classList.contains('open')) {
    drawer.classList.add('open');
    overlay.classList.add('show');
  } else {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
  }
}

function checkout() {
  if (cart.length === 0) return;
  alert('Demo Checkout Successful!');
  cart = [];
  updateCart();
  toggleCart();
}