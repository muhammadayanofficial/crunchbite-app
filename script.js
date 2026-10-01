/**
 * CrunchBite Fast Food Restaurant - Main Client Script
 * Complete Vanilla JavaScript implementation for shopping cart,
 * category filtering, search, quantity controls, and checkout.
 */

// ==========================================
// CONSTANTS & STATE
// ==========================================
const CART_STORAGE_KEY = 'crunchbite_cart';
const PROMO_STORAGE_KEY = 'crunchbite_promo';
const DELIVERY_FEE = 150;
const FREE_DELIVERY_THRESHOLD = 2000;

// ==========================================
// CART STORAGE HELPERS
// ==========================================
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading cart from localStorage', err);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateHeaderCartUI();
  } catch (err) {
    console.error('Error saving cart to localStorage', err);
  }
}

function getPromoCode() {
  try {
    return localStorage.getItem(PROMO_STORAGE_KEY) || null;
  } catch (err) {
    return null;
  }
}

function setPromoCode(code) {
  try {
    if (code) {
      localStorage.setItem(PROMO_STORAGE_KEY, code.toUpperCase());
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  } catch (err) {}
}

// ==========================================
// CALCULATE TOTALS
// ==========================================
function calculateCartTotals() {
  const cart = getCart();
  let subtotal = 0;
  let count = 0;

  cart.forEach(item => {
    subtotal += Number(item.price) * Number(item.quantity);
    count += Number(item.quantity);
  });

  // Free delivery check
  const delivery = (subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0) ? 0 : DELIVERY_FEE;

  // Promo code calculation
  const promo = getPromoCode();
  let discount = 0;
  let discountPercent = 0;

  if (promo === 'CRUNCH10' && subtotal > 0) {
    discountPercent = 10;
    discount = Math.round(subtotal * 0.10);
  }

  const grandTotal = Math.max(0, subtotal - discount + delivery);

  return {
    cart,
    count,
    subtotal,
    delivery,
    discount,
    discountPercent,
    grandTotal,
    promo
  };
}

// ==========================================
// CART OPERATIONS
// ==========================================
function addToCart(btnOrItem) {
  let item = null;

  if (btnOrItem instanceof HTMLElement) {
    const btn = btnOrItem;
    item = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image,
      category: btn.dataset.category,
      quantity: 1
    };

    // Button feedback animation
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
    btn.style.backgroundColor = 'var(--status-success)';
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.backgroundColor = '';
    }, 1000);
  } else {
    item = btnOrItem;
  }

  if (!item || !item.id) return;

  const cart = getCart();
  const existingIndex = cart.findIndex(ci => ci.id === item.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += (item.quantity || 1);
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category || 'Fast Food',
      quantity: item.quantity || 1
    });
  }

  saveCart(cart);

  // Trigger Toast Notification
  showToast(`Added <strong>${item.name}</strong> to your cart!`, 'success', 'fa-basket-shopping');

  // If on cart page, re-render
  if (document.getElementById('cart-items-container')) {
    renderCartPage();
  }
}

function updateCartQuantity(productId, delta) {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
      showToast('Item removed from cart', 'danger', 'fa-trash-can');
    }
    saveCart(cart);

    if (document.getElementById('cart-items-container')) {
      renderCartPage();
    }
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  showToast('Item removed from cart', 'danger', 'fa-trash-can');

  if (document.getElementById('cart-items-container')) {
    renderCartPage();
  }
}

function clearCart() {
  if (confirm('Are you sure you want to remove all items from your cart?')) {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateHeaderCartUI();
    showToast('Your cart has been cleared', 'danger', 'fa-trash-can');

    if (document.getElementById('cart-items-container')) {
      renderCartPage();
    }
  }
}

// ==========================================
// UI SYNCHRONIZATION
// ==========================================
function updateHeaderCartUI() {
  const totals = calculateCartTotals();

  // Desktop header badge
  const counterEl = document.getElementById('cart-counter');
  if (counterEl) {
    counterEl.textContent = totals.count;
    counterEl.classList.remove('bump');
    void counterEl.offsetWidth; // Force reflow
    counterEl.classList.add('bump');
  }

  // Header cart total price
  const headerTotalEl = document.getElementById('header-cart-total');
  if (headerTotalEl) {
    headerTotalEl.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;
  }

  // Mobile drawer badge
  const mobileCountEls = document.querySelectorAll('.mobile-cart-count');
  mobileCountEls.forEach(el => el.textContent = totals.count);

  // Mobile sticky bottom bar on menu page
  const mobileBar = document.getElementById('mobile-cart-bar');
  if (mobileBar) {
    if (totals.count > 0) {
      mobileBar.style.display = 'flex';
      const barCount = document.getElementById('mobile-cart-bar-count');
      const barTotal = document.getElementById('mobile-cart-bar-total');
      if (barCount) barCount.textContent = `${totals.count} item${totals.count > 1 ? 's' : ''}`;
      if (barTotal) barTotal.textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;
    } else {
      mobileBar.style.display = 'none';
    }
  }
}

// ==========================================
// CART PAGE RENDERER
// ==========================================
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const emptyView = document.getElementById('empty-cart-view');
  const contentWrapper = document.getElementById('cart-content-wrapper');
  const freeDeliveryBanner = document.getElementById('free-delivery-banner');

  if (!container) return;

  const totals = calculateCartTotals();

  if (totals.cart.length === 0) {
    if (contentWrapper) contentWrapper.style.display = 'none';
    if (freeDeliveryBanner) freeDeliveryBanner.style.display = 'none';
    if (emptyView) emptyView.style.display = 'block';
    return;
  }

  if (contentWrapper) contentWrapper.style.display = 'grid';
  if (freeDeliveryBanner) freeDeliveryBanner.style.display = 'block';
  if (emptyView) emptyView.style.display = 'none';

  // Render items list
  container.innerHTML = totals.cart.map(item => `
    <div class="cart-item-row" id="cart-row-${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="cart-item-unit-price">Rs. ${item.price.toLocaleString()} each</span>
      </div>
      <div class="qty-stepper">
        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Decrease quantity">
          <i class="fa-solid fa-minus"></i>
        </button>
        <span class="qty-number">${item.quantity}</span>
        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Increase quantity">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div class="cart-item-total">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
      <button class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')" title="Remove item">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');

  // Update counts & headings
  const totalHeading = document.getElementById('cart-total-items-heading');
  if (totalHeading) totalHeading.textContent = totals.count;

  const subtotalEl = document.getElementById('cart-subtotal');
  if (subtotalEl) subtotalEl.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;

  const deliveryEl = document.getElementById('cart-delivery');
  if (deliveryEl) {
    deliveryEl.textContent = totals.delivery === 0 ? 'FREE' : `Rs. ${totals.delivery}`;
    if (totals.delivery === 0) deliveryEl.classList.add('text-success');
    else deliveryEl.classList.remove('text-success');
  }

  // Discount display
  const discountRow = document.getElementById('discount-row');
  const discountVal = document.getElementById('cart-discount');
  const discountPct = document.getElementById('discount-percent');
  if (discountRow && discountVal) {
    if (totals.discount > 0) {
      discountRow.style.display = 'flex';
      discountVal.textContent = `-Rs. ${totals.discount.toLocaleString()}`;
      if (discountPct) discountPct.textContent = totals.discountPercent;
    } else {
      discountRow.style.display = 'none';
    }
  }

  const grandTotalEl = document.getElementById('cart-grand-total');
  if (grandTotalEl) grandTotalEl.textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;

  // Free delivery progress bar calculation
  const progressFill = document.getElementById('free-delivery-progress-bar');
  const progressMsg = document.getElementById('free-delivery-message');
  if (progressFill && progressMsg) {
    const percentage = Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100);
    progressFill.style.width = `${percentage}%`;

    if (totals.subtotal >= FREE_DELIVERY_THRESHOLD) {
      progressMsg.innerHTML = '<i class="fa-solid fa-circle-check text-success"></i> <strong>Congratulations!</strong> You have qualified for <strong>FREE Delivery</strong>!';
    } else {
      const remaining = FREE_DELIVERY_THRESHOLD - totals.subtotal;
      progressMsg.innerHTML = `<i class="fa-solid fa-truck-fast text-accent"></i> Add <strong>Rs. ${remaining.toLocaleString()}</strong> more to get <strong>FREE Delivery</strong>!`;
    }
  }
}

// ==========================================
// CHECKOUT PAGE RENDERER
// ==========================================
function renderCheckoutPage() {
  const previewContainer = document.getElementById('checkout-items-preview');
  if (!previewContainer) return;

  const totals = calculateCartTotals();

  // If cart is empty, redirect to menu or show notice
  if (totals.cart.length === 0) {
    previewContainer.innerHTML = '<p class="text-muted">Your cart is empty. Please add items before checking out.</p>';
    const submitBtn = document.getElementById('place-order-submit-btn');
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  // Populate preview list
  previewContainer.innerHTML = totals.cart.map(item => `
    <div class="checkout-preview-item">
      <span>${item.quantity}x ${item.name}</span>
      <strong>Rs. ${(item.price * item.quantity).toLocaleString()}</strong>
    </div>
  `).join('');

  // Update summary fields
  const subtotalEl = document.getElementById('checkout-subtotal');
  if (subtotalEl) subtotalEl.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;

  const deliveryEl = document.getElementById('checkout-delivery');
  if (deliveryEl) {
    deliveryEl.textContent = totals.delivery === 0 ? 'FREE' : `Rs. ${totals.delivery}`;
    if (totals.delivery === 0) deliveryEl.classList.add('text-success');
  }

  const discountRow = document.getElementById('checkout-discount-row');
  const discountVal = document.getElementById('checkout-discount');
  if (discountRow && discountVal) {
    if (totals.discount > 0) {
      discountRow.style.display = 'flex';
      discountVal.textContent = `-Rs. ${totals.discount.toLocaleString()}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  const totalEl = document.getElementById('checkout-total');
  if (totalEl) totalEl.textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;

  const btnTotalEl = document.getElementById('btn-order-total');
  if (btnTotalEl) btnTotalEl.textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;

  // Sync with hidden form input for backend processing
  const hiddenJson = document.getElementById('checkout-cart-json');
  if (hiddenJson) {
    hiddenJson.value = JSON.stringify(totals.cart);
  }
}

// ==========================================
// PROMO CODE VOUCHER HANDLER
// ==========================================
function applyPromoCode() {
  const input = document.getElementById('promo-input');
  const messageEl = document.getElementById('promo-message');
  if (!input) return;

  const code = input.value.trim().toUpperCase();

  if (code === 'CRUNCH10') {
    setPromoCode('CRUNCH10');
    if (messageEl) {
      messageEl.innerHTML = '<span class="text-success"><i class="fa-solid fa-check"></i> Code CRUNCH10 applied! 10% discount added.</span>';
    }
    showToast('Promo code applied successfully!', 'success', 'fa-percent');
    renderCartPage();
  } else {
    if (messageEl) {
      messageEl.innerHTML = '<span class="text-danger"><i class="fa-solid fa-xmark"></i> Invalid promo code. Try "CRUNCH10"</span>';
    }
    showToast('Invalid promo code', 'danger', 'fa-circle-xmark');
  }
}

function copyPromoCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Code <strong>${code}</strong> copied to clipboard!`, 'success', 'fa-copy');
  }).catch(() => {
    showToast(`Use promo code: ${code}`, 'info', 'fa-tag');
  });
}

// ==========================================
// CHECKOUT FORM & PAYMENT HANDLER
// ==========================================
function handlePaymentChange(radio) {
  document.querySelectorAll('.payment-option-card').forEach(card => card.classList.remove('selected'));
  if (radio.closest('.payment-option-card')) {
    radio.closest('.payment-option-card').classList.add('selected');
  }

  const cardFieldsBox = document.getElementById('card-fields-box');
  if (cardFieldsBox) {
    cardFieldsBox.style.display = radio.value === 'credit_card' ? 'block' : 'none';
  }
}

function handleCheckoutSubmit(e) {
  const totals = calculateCartTotals();

  if (totals.cart.length === 0) {
    e.preventDefault();
    showToast('Your cart is empty! Add some delicious food first.', 'danger', 'fa-basket-shopping');
    return false;
  }

  // Update hidden JSON value before submission
  const hiddenJson = document.getElementById('checkout-cart-json');
  if (hiddenJson) {
    hiddenJson.value = JSON.stringify(totals.cart);
  }

  // Clear cart in local storage after a brief moment so confirmation shows
  setTimeout(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateHeaderCartUI();
  }, 300);

  return true;
}

// ==========================================
// CONTACT FORM HANDLER
// ==========================================
function handleContactSubmit(e) {
  // Can submit natively via POST to Flask or with quick feedback
  showToast('Thank you! Your message is being sent...', 'info', 'fa-paper-plane');
}

// ==========================================
// MENU SEARCH & FILTERING
// ==========================================
function initMenuFilters() {
  const searchInput = document.getElementById('menu-search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  const catButtons = document.querySelectorAll('#category-tabs .cat-tab-btn');
  const sortSelect = document.getElementById('menu-sort-select');

  if (!searchInput && catButtons.length === 0) return;

  let currentCategory = 'all';
  let searchQuery = '';

  // Handle Category Buttons
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category || 'all';
      applyMenuFiltering();
    });
  });

  // Handle Search Input with debounce
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
      }
      applyMenuFiltering();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        applyMenuFiltering();
      });
    }
  }

  // Handle Sort Select
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortMenuItems(sortSelect.value);
    });
  }

  function applyMenuFiltering() {
    const cards = document.querySelectorAll('#menu-products-grid .product-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCat = card.dataset.category;
      const cardName = card.dataset.name || '';
      const cardDesc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';

      const matchesCat = (currentCategory === 'all' || cardCat === currentCategory);
      const matchesSearch = (!searchQuery || cardName.includes(searchQuery) || cardDesc.includes(searchQuery));

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count display
    const countEl = document.getElementById('visible-items-count');
    if (countEl) countEl.textContent = visibleCount;

    // Show empty state if no matches
    const emptyState = document.getElementById('empty-search-state');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  function sortMenuItems(criteria) {
    const grid = document.getElementById('menu-products-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));

    cards.sort((a, b) => {
      const priceA = Number(a.dataset.price || 0);
      const priceB = Number(b.dataset.price || 0);
      const ratingA = Number(a.dataset.rating || 0);
      const ratingB = Number(b.dataset.rating || 0);

      if (criteria === 'price-low') return priceA - priceB;
      if (criteria === 'price-high') return priceB - priceA;
      if (criteria === 'rating') return ratingB - ratingA;
      return 0; // Default order
    });

    cards.forEach(card => grid.appendChild(card));
  }
}

function resetFilters() {
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) searchInput.value = '';
  const firstTab = document.querySelector('#category-tabs .cat-tab-btn');
  if (firstTab) firstTab.click();
}

// ==========================================
// QUICK VIEW MODAL
// ==========================================
function showProductModal(productId) {
  const card = document.getElementById(`product-${productId}`);
  if (!card) return;

  const modal = document.getElementById('product-modal');
  const modalContent = document.getElementById('modal-content');
  if (!modal || !modalContent) return;

  const name = card.querySelector('.product-name')?.textContent || '';
  const desc = card.querySelector('.product-desc')?.textContent || '';
  const price = card.dataset.price || '';
  const img = card.querySelector('.product-image')?.src || '';
  const category = card.querySelector('.product-category-label')?.textContent || '';
  const badge = card.querySelector('.product-badge')?.textContent || '';

  modalContent.innerHTML = `
    <img src="${img}" alt="${name}" class="modal-product-img">
    <div class="modal-product-content">
      <div class="product-meta">
        <span class="product-category-label">${category}</span>
        ${badge ? `<span class="product-badge" style="position:static;">${badge}</span>` : ''}
      </div>
      <h2 style="font-size:1.5rem; margin:8px 0;">${name}</h2>
      <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:20px; line-height:1.6;">${desc}</p>
      
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:16px;">
        <div class="product-price-box">
          <span class="price-currency">Rs.</span>
          <span class="price-amount" style="font-size:1.6rem;">${price}</span>
        </div>
        <button 
          class="btn btn-primary btn-glow"
          data-id="${productId}"
          data-name="${name}"
          data-price="${price}"
          data-image="${img}"
          data-category="${category}"
          onclick="addToCart(this); closeProductModal();"
        >
          <i class="fa-solid fa-basket-shopping"></i> Add To Cart
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal(event) {
  if (event && event.target && event.target.closest && event.target.closest('.modal-container') && !event.target.classList.contains('modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info', icon = 'fa-circle-info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ==========================================
// MOBILE DRAWER NAVIGATION
// ==========================================
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
}

// ==========================================
// STICKY HEADER SCROLL EFFECT
// ==========================================
function initScrollEffect() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ==========================================
// INITIALIZE ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderCartUI();
  initMobileDrawer();
  initScrollEffect();
  initMenuFilters();

  // If on Cart page
  if (document.getElementById('cart-items-container')) {
    renderCartPage();
    // Pre-populate promo if saved
    const savedPromo = getPromoCode();
    if (savedPromo) {
      const promoInput = document.getElementById('promo-input');
      if (promoInput) promoInput.value = savedPromo;
    }
  }

  // If on Checkout page
  if (document.getElementById('checkout-items-preview')) {
    renderCheckoutPage();
  }
});
