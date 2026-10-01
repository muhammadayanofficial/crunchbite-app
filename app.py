"""
Crispy Corner - Fast Food Restaurant Web Application
A modern, beginner-friendly Flask application with dynamic Jinja2 templates,
category-filtered menu, shopping cart, checkout, and order management.
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import json
import os
import random
from datetime import datetime

app = Flask(__name__)
app.secret_key = "crunchbite_secret_super_crispy_key_2026"

# ==========================================
# FOOD MENU DATABASE (PKR Pricing)
# ==========================================
PRODUCTS = [
    # --- Burgers ---
    {
        "id": "crunch-classic-burger",
        "name": "Crunch Classic Burger",
        "category": "burgers",
        "category_name": "Burgers",
        "price": 499,
        "description": "Juicy grilled beef patty, melted cheddar cheese, crisp lettuce, fresh pickles, and our signature Crunch sauce in a toasted brioche bun.",
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        "badge": "Bestseller",
        "rating": 4.9,
        "reviews": 320,
        "spicy": False,
        "prep_time": "12-15 mins"
    },
    {
        "id": "zinger-burger",
        "name": "Zinger Burger",
        "category": "burgers",
        "category_name": "Burgers",
        "price": 599,
        "description": "Crispy golden fried chicken breast fillet tossed in fiery spices, topped with iceberg lettuce and creamy garlic mayo.",
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
        "badge": "Chef Special",
        "rating": 4.9,
        "reviews": 512,
        "spicy": True,
        "prep_time": "10-14 mins"
    },
    {
        "id": "double-smash-burger",
        "name": "Double Smash Burger",
        "category": "burgers",
        "category_name": "Burgers",
        "price": 799,
        "description": "Two crispy-edged smashed beef patties, double American cheddar cheese, caramelized onions, and smoky BBQ drizzle.",
        "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
        "badge": "Heavy Duty",
        "rating": 4.8,
        "reviews": 189,
        "spicy": False,
        "prep_time": "15-18 mins"
    },

    # --- Fried Chicken ---
    {
        "id": "crispy-chicken-3pcs",
        "name": "Crispy Fried Chicken (3 Pcs)",
        "category": "fried-chicken",
        "category_name": "Fried Chicken",
        "price": 449,
        "description": "Fresh bone-in chicken marinated in secret 11 herbs & spices, coated with crunchy golden breading and fried to perfection.",
        "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
        "badge": "Super Crispy",
        "rating": 4.9,
        "reviews": 430,
        "spicy": True,
        "prep_time": "15-20 mins"
    },
    {
        "id": "chicken-tenders-box",
        "name": "Crunchy Chicken Tenders (5 Pcs)",
        "category": "fried-chicken",
        "category_name": "Fried Chicken",
        "price": 499,
        "description": "Hand-breaded 100% chicken breast tenders served with signature honey mustard and spicy chipotle dips.",
        "image": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
        "badge": "Popular",
        "rating": 4.7,
        "reviews": 210,
        "spicy": False,
        "prep_time": "10-12 mins"
    },

    # --- Pizza ---
    {
        "id": "cheese-pizza",
        "name": "Cheese Supreme Pizza",
        "category": "pizza",
        "category_name": "Pizza",
        "price": 999,
        "description": "Stone-baked hand-stretched crust smothered in rich tomato herb sauce and a decadent triple blend of stretchy mozzarella & cheddar.",
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        "badge": "Classic",
        "rating": 4.8,
        "reviews": 275,
        "spicy": False,
        "prep_time": "20-25 mins"
    },
    {
        "id": "chicken-tikka-pizza",
        "name": "Fiery Chicken Tikka Pizza",
        "category": "pizza",
        "category_name": "Pizza",
        "price": 1199,
        "description": "Tender tandoori chicken chunks, sweet bell peppers, red onions, jalapeños, black olives, and melted mozzarella on our crispy crust.",
        "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
        "badge": "Local Hit",
        "rating": 4.9,
        "reviews": 360,
        "spicy": True,
        "prep_time": "20-25 mins"
    },

    # --- Fries ---
    {
        "id": "loaded-fries",
        "name": "Loaded Monster Fries",
        "category": "fries",
        "category_name": "Fries",
        "price": 399,
        "description": "Golden skin-on french fries showered in warm cheese sauce, crispy fried chicken bites, jalapeño rings, and Crunch drizzle.",
        "image": "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
        "badge": "Must Try",
        "rating": 4.9,
        "reviews": 610,
        "spicy": True,
        "prep_time": "8-10 mins"
    },
    {
        "id": "peri-peri-fries",
        "name": "Peri Peri Curly Fries",
        "category": "fries",
        "category_name": "Fries",
        "price": 279,
        "description": "Spiral cut crispy fries dusted with zesty African bird's eye chili seasoning and served with garlic aioli.",
        "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
        "badge": "Zesty",
        "rating": 4.6,
        "reviews": 145,
        "spicy": True,
        "prep_time": "7-9 mins"
    },

    # --- Wraps ---
    {
        "id": "chicken-wrap",
        "name": "Crispy Chicken Wrap",
        "category": "wraps",
        "category_name": "Wraps",
        "price": 449,
        "description": "Golden chicken tender strips wrapped in a warm toasted tortilla with crunchy shredded lettuce, diced tomatoes, and ranch dressing.",
        "image": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
        "badge": "Fresh Pick",
        "rating": 4.7,
        "reviews": 198,
        "spicy": False,
        "prep_time": "10-12 mins"
    },
    {
        "id": "bbq-smoky-wrap",
        "name": "Smoky BBQ Grilled Wrap",
        "category": "wraps",
        "category_name": "Wraps",
        "price": 479,
        "description": "Char-grilled spicy chicken strips with melted cheese, caramelized onions, and hickory BBQ sauce inside a toasted flatbread.",
        "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "badge": "Smoky",
        "rating": 4.8,
        "reviews": 164,
        "spicy": False,
        "prep_time": "10-12 mins"
    },

    # --- Drinks ---
    {
        "id": "cold-drink",
        "name": "Chilled Soft Drink (500ml)",
        "category": "drinks",
        "category_name": "Drinks",
        "price": 150,
        "description": "Ice-cold refreshing beverage of your choice (Cola, Sprite, Fanta, or Diet Cola). Served with ice cup.",
        "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
        "badge": "Chilled",
        "rating": 4.9,
        "reviews": 840,
        "spicy": False,
        "prep_time": "2 mins"
    },
    {
        "id": "mint-margarita",
        "name": "Crunch Special Mint Margarita",
        "category": "drinks",
        "category_name": "Drinks",
        "price": 249,
        "description": "Frosty crushed ice blend of fresh garden mint, tangy lemon juice, soda, and Himalayan black salt.",
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
        "badge": "Refreshing",
        "rating": 4.9,
        "reviews": 310,
        "spicy": False,
        "prep_time": "5 mins"
    },

    # --- Desserts ---
    {
        "id": "chocolate-brownie",
        "name": "Fudge Chocolate Brownie",
        "category": "desserts",
        "category_name": "Desserts",
        "price": 299,
        "description": "Warm, rich dark chocolate fudge brownie topped with molten Belgian chocolate sauce and crushed walnuts.",
        "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        "badge": "Sweet Tooth",
        "rating": 4.9,
        "reviews": 412,
        "spicy": False,
        "prep_time": "5 mins"
    },
    {
        "id": "lava-cake",
        "name": "Molten Chocolate Lava Cake",
        "category": "desserts",
        "category_name": "Desserts",
        "price": 380,
        "description": "Decadent chocolate sponge cake filled with a gooey erupting center of warm melted chocolate ganache.",
        "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        "badge": "Irresistible",
        "rating": 4.9,
        "reviews": 289,
        "spicy": False,
        "prep_time": "8 mins"
    }
]

CATEGORIES = [
    {"id": "all", "name": "All Items", "icon": "fa-utensils"},
    {"id": "burgers", "name": "Burgers", "icon": "fa-burger"},
    {"id": "pizza", "name": "Pizza", "icon": "fa-pizza-slice"},
    {"id": "fried-chicken", "name": "Fried Chicken", "icon": "fa-drumstick-bite"},
    {"id": "fries", "name": "Fries", "icon": "fa-french-fries"},
    {"id": "wraps", "name": "Wraps", "icon": "fa-bread-slice"},
    {"id": "drinks", "name": "Drinks", "icon": "fa-wine-bottle"},
    {"id": "desserts", "name": "Desserts", "icon": "fa-ice-cream"}
]

DELIVERY_FEE = 150
FREE_DELIVERY_THRESHOLD = 2000

# ==========================================
# FLASK ROUTES
# ==========================================

@app.route("/")
def index():
    """Home page with hero, featured products, highlights, and customer reviews."""
    featured_products = [p for p in PRODUCTS if p.get("badge") in ["Bestseller", "Chef Special", "Must Try", "Super Crispy"]]
    return render_template(
        "index.html",
        products=PRODUCTS,
        featured_products=featured_products,
        categories=CATEGORIES,
        delivery_fee=DELIVERY_FEE,
        free_delivery_threshold=FREE_DELIVERY_THRESHOLD
    )


@app.route("/menu")
def menu():
    """Menu page with category filtering and search."""
    selected_category = request.args.get("category", "all")
    search_query = request.args.get("search", "").strip().lower()

    filtered_products = PRODUCTS
    if selected_category and selected_category != "all":
        filtered_products = [p for p in filtered_products if p["category"] == selected_category]

    if search_query:
        filtered_products = [
            p for p in filtered_products
            if search_query in p["name"].lower() or search_query in p["description"].lower() or search_query in p["category_name"].lower()
        ]

    return render_template(
        "menu.html",
        products=filtered_products,
        all_products=PRODUCTS,
        categories=CATEGORIES,
        selected_category=selected_category,
        search_query=search_query,
        delivery_fee=DELIVERY_FEE
    )


@app.route("/cart")
def cart():
    """Cart view. The items are synchronized dynamically via client-side JavaScript."""
    return render_template(
        "cart.html",
        products=PRODUCTS,
        delivery_fee=DELIVERY_FEE,
        free_delivery_threshold=FREE_DELIVERY_THRESHOLD
    )


@app.route("/checkout", methods=["GET", "POST"])
def checkout():
    """Checkout page to place the order."""
    if request.method == "POST":
        customer_name = request.form.get("name", "").strip()
        phone = request.form.get("phone", "").strip()
        address = request.form.get("address", "").strip()
        city = request.form.get("city", "").strip()
        payment_method = request.form.get("payment_method", "cash_on_delivery")
        order_notes = request.form.get("notes", "").strip()
        cart_data_raw = request.form.get("cart_json", "[]")

        try:
            cart_items = json.loads(cart_data_raw)
        except Exception:
            cart_items = []

        subtotal = sum(item.get("price", 0) * item.get("quantity", 1) for item in cart_items)
        delivery = 0 if subtotal >= FREE_DELIVERY_THRESHOLD or subtotal == 0 else DELIVERY_FEE
        total = subtotal + delivery

        order_id = f"CB-{random.randint(10000, 99999)}"

        order_details = {
            "order_id": order_id,
            "customer_name": customer_name,
            "phone": phone,
            "address": address,
            "city": city,
            "payment_method": payment_method.replace("_", " ").title(),
            "notes": order_notes,
            "cart_items": cart_items,
            "subtotal": subtotal,
            "delivery_fee": delivery,
            "total": total,
            "created_at": datetime.now().strftime("%B %d, %Y - %I:%M %p"),
            "estimated_delivery": "30-40 mins"
        }

        return render_template("checkout.html", order=order_details, success=True, delivery_fee=DELIVERY_FEE)

    return render_template(
        "checkout.html",
        products=PRODUCTS,
        delivery_fee=DELIVERY_FEE,
        free_delivery_threshold=FREE_DELIVERY_THRESHOLD,
        order=None,
        success=False
    )


@app.route("/about")
def about():
    """About page with story, mission, fresh ingredients, and stats."""
    return render_template("about.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    """Contact page with form and restaurant details."""
    success_msg = None
    if request.method == "POST":
        name = request.form.get("name")
        success_msg = f"Thank you, {name}! Your message has been received. Our Crunch Crew will contact you shortly."
    return render_template("contact.html", success_msg=success_msg)


# ==========================================
# REST API ENDPOINTS (Useful for AJAX)
# ==========================================

@app.route("/api/products")
def api_products():
    """Return all products as JSON for quick JavaScript filtering."""
    return jsonify({
        "status": "success",
        "count": len(PRODUCTS),
        "products": PRODUCTS
    })


@app.route("/api/order", methods=["POST"])
def api_order():
    """Process an order via AJAX/JSON."""
    data = request.get_json() or {}
    order_id = f"CB-{random.randint(10000, 99999)}"
    return jsonify({
        "status": "success",
        "message": "Your order has been placed successfully!",
        "order_id": order_id,
        "data": data
    })


# ==========================================
# RUN SERVER
# ==========================================
if __name__ == "__main__":
    # Standard local Flask runner
    print("==================================================")
    print(" Crispy Corner Restaurant - Flask Server")
    print(" Running locally at: http://127.0.0.1:5000")
    print("==================================================")
    app.run(host="0.0.0.0", port=5000, debug=True)
