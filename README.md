# Crispy Corner - Fast Food Restaurant Website

**Crispy Corner** is a modern fast-food restaurant web application built with HTML, CSS, JavaScript, and Flask (Python) with Jinja2 templates.

---

## Project Structure

```text
crunchbite/
│
├── app.py                     # Main Flask Python application with routes and menu data
├── requirements.txt           # Python dependencies (Flask, Jinja2, Werkzeug)
│
├── templates/                 # Jinja2 HTML Templates
│   ├── base.html              # Base layout with navbar, footer, cart badge, drawer
│   ├── index.html             # Home page with hero, featured items, deals, why us
│   ├── menu.html              # Menu page with categories, live search, sort & filters
│   ├── about.html             # Story, mission, fresh ingredients & stats
│   ├── contact.html           # Contact form, phone, location & map placeholder
│   ├── cart.html              # Interactive shopping cart with quantity stepper
│   └── checkout.html          # Checkout form & order confirmation screen
│
├── static/
│   ├── css/
│   │   └── style.css          # Fast-food themed responsive stylesheet
│   ├── js/
│   │   └── script.js          # Cart state, search, toast notifications & checkout
│   └── images/                # Local image directory for offline photos
```

---

## How to Run Locally with Python & Flask

### Step 1: Install Dependencies
Open your terminal in the `crunchbite` folder and run:

```bash
pip install -r requirements.txt
```

### Step 2: Start the Flask App
Run the following command:

```bash
python app.py
```

### Step 3: Open in Your Browser
Visit:
```text
http://127.0.0.1:5000
```

---

## Website Features

1. **Home Page (`/`)**:
   - Hero banner with headline *"Fresh. Crispy. Delicious."*
   - Direct *"Order Now"* and *"View Menu"* buttons
   - Category browse cards (Burgers, Fried Chicken, Pizza, Fries, Wraps, Drinks, Desserts)
   - Signature bestsellers with live Add-to-Cart
   - Limited-time promotional box offer with promo code `CRUNCH10`
   - Customer testimonials and trust indicators

2. **Menu Page (`/menu`)**:
   - Live category tabs (Burgers, Pizza, Fried Chicken, Fries, Wraps, Drinks, Desserts)
   - Real-time instant search by food name or description
   - Sorting by Price (Low to High, High to Low) and Top Rated
   - Item cards with prices in PKR, badges, and quick view modal
   - Floating cart drawer on mobile view

3. **Cart Page (`/cart`)**:
   - Add/Remove products with `+` and `-` quantity steppers
   - Dynamic real-time calculations: Subtotal, Delivery Fee, Discount, and Total
   - Free delivery progress meter (qualifies on orders over Rs. 2,000)
   - Special cooking instructions notes box
   - Promo voucher input (`CRUNCH10` grants 10% discount)

4. **Checkout Page (`/checkout`)**:
   - Customer contact information (Name, Phone, Email)
   - Delivery details with city selection (Lahore, Karachi, Islamabad, etc.)
   - Payment method selection:
     - Cash on Delivery (COD)
     - JazzCash Mobile Account
     - EasyPaisa Mobile Wallet
     - Credit / Debit Card
   - Instant order confirmation screen with Order ID (e.g. `CB-84920`), estimated delivery time (30-40 mins), customer details, item breakdown, and printable receipt.

5. **About Us (`/about`)**:
   - The CrunchBite founding story
   - Core pillars and quality guarantees
   - Farm-to-fryer fresh ingredients breakdown

6. **Contact Us (`/contact`)**:
   - Customer feedback and inquiry form
   - Hotline number (`042-111-CRUNCH`) and email
   - Interactive styled Google Maps store pin
   - Outlet branch listings and FAQs
