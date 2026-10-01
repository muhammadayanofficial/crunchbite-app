import express from "express";
import path from "path";
import nunjucks from "nunjucks";

const app = express();
const PORT = 3000;

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Nunjucks for Jinja2 template rendering
const nunjucksEnv = nunjucks.configure(path.join(process.cwd(), "templates"), {
  autoescape: true,
  express: app,
  noCache: true,
  watch: false
});

// Add global helper functions to match Flask/Jinja2
nunjucksEnv.addGlobal("get_flashed_messages", () => []);

// Serve Static Assets (/static/css, /static/js, /static/images)
app.use("/static", express.static(path.join(process.cwd(), "static")));

// ==========================================
// FOOD MENU DATABASE (PKR Pricing)
// ==========================================
const PRODUCTS = [
  // --- Burgers ---
  {
    id: "crunch-classic-burger",
    name: "Crunch Classic Burger",
    category: "burgers",
    category_name: "Burgers",
    price: 499,
    description: "Juicy grilled beef patty, melted cheddar cheese, crisp lettuce, fresh pickles, and our signature Crunch sauce in a toasted brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 320,
    spicy: false,
    prep_time: "12-15 mins"
  },
  {
    id: "zinger-burger",
    name: "Zinger Burger",
    category: "burgers",
    category_name: "Burgers",
    price: 599,
    description: "Crispy golden fried chicken breast fillet tossed in fiery spices, topped with iceberg lettuce and creamy garlic mayo.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    badge: "Chef Special",
    rating: 4.9,
    reviews: 512,
    spicy: true,
    prep_time: "10-14 mins"
  },
  {
    id: "double-smash-burger",
    name: "Double Smash Burger",
    category: "burgers",
    category_name: "Burgers",
    price: 799,
    description: "Two crispy-edged smashed beef patties, double American cheddar cheese, caramelized onions, and smoky BBQ drizzle.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    badge: "Heavy Duty",
    rating: 4.8,
    reviews: 189,
    spicy: false,
    prep_time: "15-18 mins"
  },

  // --- Fried Chicken ---
  {
    id: "crispy-chicken-3pcs",
    name: "Crispy Fried Chicken (3 Pcs)",
    category: "fried-chicken",
    category_name: "Fried Chicken",
    price: 449,
    description: "Fresh bone-in chicken marinated in secret 11 herbs & spices, coated with crunchy golden breading and fried to perfection.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    badge: "Super Crispy",
    rating: 4.9,
    reviews: 430,
    spicy: true,
    prep_time: "15-20 mins"
  },
  {
    id: "chicken-tenders-box",
    name: "Crunchy Chicken Tenders (5 Pcs)",
    category: "fried-chicken",
    category_name: "Fried Chicken",
    price: 499,
    description: "Hand-breaded 100% chicken breast tenders served with signature honey mustard and spicy chipotle dips.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
    rating: 4.7,
    reviews: 210,
    spicy: false,
    prep_time: "10-12 mins"
  },

  // --- Pizza ---
  {
    id: "cheese-pizza",
    name: "Cheese Supreme Pizza",
    category: "pizza",
    category_name: "Pizza",
    price: 999,
    description: "Stone-baked hand-stretched crust smothered in rich tomato herb sauce and a decadent triple blend of stretchy mozzarella & cheddar.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    badge: "Classic",
    rating: 4.8,
    reviews: 275,
    spicy: false,
    prep_time: "20-25 mins"
  },
  {
    id: "chicken-tikka-pizza",
    name: "Fiery Chicken Tikka Pizza",
    category: "pizza",
    category_name: "Pizza",
    price: 1199,
    description: "Tender tandoori chicken chunks, sweet bell peppers, red onions, jalapeños, black olives, and melted mozzarella on our crispy crust.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    badge: "Local Hit",
    rating: 4.9,
    reviews: 360,
    spicy: true,
    prep_time: "20-25 mins"
  },

  // --- Fries ---
  {
    id: "loaded-fries",
    name: "Loaded Monster Fries",
    category: "fries",
    category_name: "Fries",
    price: 399,
    description: "Golden skin-on french fries showered in warm cheese sauce, crispy fried chicken bites, jalapeño rings, and Crunch drizzle.",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
    badge: "Must Try",
    rating: 4.9,
    reviews: 610,
    spicy: true,
    prep_time: "8-10 mins"
  },
  {
    id: "peri-peri-fries",
    name: "Peri Peri Curly Fries",
    category: "fries",
    category_name: "Fries",
    price: 279,
    description: "Spiral cut crispy fries dusted with zesty African bird's eye chili seasoning and served with garlic aioli.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    badge: "Zesty",
    rating: 4.6,
    reviews: 145,
    spicy: true,
    prep_time: "7-9 mins"
  },

  // --- Wraps ---
  {
    id: "chicken-wrap",
    name: "Crispy Chicken Wrap",
    category: "wraps",
    category_name: "Wraps",
    price: 449,
    description: "Golden chicken tender strips wrapped in a warm toasted tortilla with crunchy shredded lettuce, diced tomatoes, and ranch dressing.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    badge: "Fresh Pick",
    rating: 4.7,
    reviews: 198,
    spicy: false,
    prep_time: "10-12 mins"
  },
  {
    id: "bbq-smoky-wrap",
    name: "Smoky BBQ Grilled Wrap",
    category: "wraps",
    category_name: "Wraps",
    price: 479,
    description: "Char-grilled spicy chicken strips with melted cheese, caramelized onions, and hickory BBQ sauce inside a toasted flatbread.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    badge: "Smoky",
    rating: 4.8,
    reviews: 164,
    spicy: false,
    prep_time: "10-12 mins"
  },

  // --- Drinks ---
  {
    id: "cold-drink",
    name: "Chilled Soft Drink (500ml)",
    category: "drinks",
    category_name: "Drinks",
    price: 150,
    description: "Ice-cold refreshing beverage of your choice (Cola, Sprite, Fanta, or Diet Cola). Served with ice cup.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    badge: "Chilled",
    rating: 4.9,
    reviews: 840,
    spicy: false,
    prep_time: "2 mins"
  },
  {
    id: "mint-margarita",
    name: "Crunch Special Mint Margarita",
    category: "drinks",
    category_name: "Drinks",
    price: 249,
    description: "Frosty crushed ice blend of fresh garden mint, tangy lemon juice, soda, and Himalayan black salt.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    badge: "Refreshing",
    rating: 4.9,
    reviews: 310,
    spicy: false,
    prep_time: "5 mins"
  },

  // --- Desserts ---
  {
    id: "chocolate-brownie",
    name: "Fudge Chocolate Brownie",
    category: "desserts",
    category_name: "Desserts",
    price: 299,
    description: "Warm, rich dark chocolate fudge brownie topped with molten Belgian chocolate sauce and crushed walnuts.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    badge: "Sweet Tooth",
    rating: 4.9,
    reviews: 412,
    spicy: false,
    prep_time: "5 mins"
  },
  {
    id: "lava-cake",
    name: "Molten Chocolate Lava Cake",
    category: "desserts",
    category_name: "Desserts",
    price: 380,
    description: "Decadent chocolate sponge cake filled with a gooey erupting center of warm melted chocolate ganache.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    badge: "Irresistible",
    rating: 4.9,
    reviews: 289,
    spicy: false,
    prep_time: "8 mins"
  }
];

const CATEGORIES = [
  { id: "all", name: "All Items", icon: "fa-utensils" },
  { id: "burgers", name: "Burgers", icon: "fa-burger" },
  { id: "pizza", name: "Pizza", icon: "fa-pizza-slice" },
  { id: "fried-chicken", name: "Fried Chicken", icon: "fa-drumstick-bite" },
  { id: "fries", name: "Fries", icon: "fa-french-fries" },
  { id: "wraps", name: "Wraps", icon: "fa-bread-slice" },
  { id: "drinks", name: "Drinks", icon: "fa-wine-bottle" },
  { id: "desserts", name: "Desserts", icon: "fa-ice-cream" }
];

const DELIVERY_FEE = 150;
const FREE_DELIVERY_THRESHOLD = 2000;

// ==========================================
// ROUTES
// ==========================================

// Home Route
app.get("/", (req, res) => {
  const featured_products = PRODUCTS.filter(p =>
    ["Bestseller", "Chef Special", "Must Try", "Super Crispy"].includes(p.badge)
  );

  res.render("index.html", {
    products: PRODUCTS,
    featured_products,
    categories: CATEGORIES,
    delivery_fee: DELIVERY_FEE,
    free_delivery_threshold: FREE_DELIVERY_THRESHOLD,
    request: req
  });
});

// Menu Route
app.get("/menu", (req, res) => {
  const selected_category = (req.query.category as string) || "all";
  const search_query = ((req.query.search as string) || "").trim().toLowerCase();

  let filtered = PRODUCTS;
  if (selected_category && selected_category !== "all") {
    filtered = filtered.filter(p => p.category === selected_category);
  }

  if (search_query) {
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(search_query) ||
        p.description.toLowerCase().includes(search_query) ||
        p.category_name.toLowerCase().includes(search_query)
    );
  }

  res.render("menu.html", {
    products: filtered,
    all_products: PRODUCTS,
    categories: CATEGORIES,
    selected_category,
    search_query,
    delivery_fee: DELIVERY_FEE,
    request: req
  });
});

// Cart Route
app.get("/cart", (req, res) => {
  res.render("cart.html", {
    products: PRODUCTS,
    delivery_fee: DELIVERY_FEE,
    free_delivery_threshold: FREE_DELIVERY_THRESHOLD,
    request: req
  });
});

// Checkout Route (GET & POST)
app.get("/checkout", (req, res) => {
  res.render("checkout.html", {
    products: PRODUCTS,
    delivery_fee: DELIVERY_FEE,
    free_delivery_threshold: FREE_DELIVERY_THRESHOLD,
    order: null,
    success: false,
    request: req
  });
});

app.post("/checkout", (req, res) => {
  const customer_name = (req.body.name || "").trim();
  const phone = (req.body.phone || "").trim();
  const address = (req.body.address || "").trim();
  const city = (req.body.city || "").trim();
  const payment_method = (req.body.payment_method || "cash_on_delivery").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const notes = (req.body.notes || "").trim();

  let cart_items: Array<{ id: string; name: string; price: number; quantity: number }> = [];
  try {
    cart_items = JSON.parse(req.body.cart_json || "[]");
  } catch (err) {
    cart_items = [];
  }

  const subtotal = cart_items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const order_id = `CB-${Math.floor(10000 + Math.random() * 90000)}`;

  const order_details = {
    order_id,
    customer_name,
    phone,
    address,
    city,
    payment_method,
    notes,
    cart_items,
    subtotal,
    delivery_fee: delivery,
    total,
    estimated_delivery: "30-40 mins"
  };

  res.render("checkout.html", {
    order: order_details,
    success: true,
    delivery_fee: DELIVERY_FEE,
    request: req
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about.html", { request: req });
});

// Contact Route (GET & POST)
app.get("/contact", (req, res) => {
  res.render("contact.html", { success_msg: null, request: req });
});

app.post("/contact", (req, res) => {
  const name = req.body.name || "Foodie";
  const success_msg = `Thank you, ${name}! Your message has been received. Our Crunch Crew will contact you shortly.`;
  res.render("contact.html", { success_msg, request: req });
});

// REST APIs
app.get("/api/products", (req, res) => {
  res.json({
    status: "success",
    count: PRODUCTS.length,
    products: PRODUCTS
  });
});

app.post("/api/order", (req, res) => {
  const order_id = `CB-${Math.floor(10000 + Math.random() * 90000)}`;
  res.json({
    status: "success",
    message: "Your order has been placed successfully!",
    order_id,
    data: req.body
  });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Crispy Corner] Fast Food Server running on http://0.0.0.0:${PORT}`);
});
