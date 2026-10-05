const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Serve Frontend folder
app.use(express.static(path.join(__dirname, "Frontend")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

// Test backend
app.get("/test-db", (req, res) => {
    const sql = "SELECT 1 + 1 AS result";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});


// =========================
// GET ALL DATA
// =========================

app.get("/customers", (req, res) => {
    db.query("SELECT * FROM customer", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/restaurants", (req, res) => {
    db.query("SELECT * FROM restaurant", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/foods", (req, res) => {
    db.query("SELECT * FROM food_item", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/categories", (req, res) => {
    db.query("SELECT * FROM category", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/order-items", (req, res) => {
    db.query("SELECT * FROM order_item", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/payments", (req, res) => {
    db.query("SELECT * FROM payment", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/delivery-partners", (req, res) => {
    db.query("SELECT * FROM delivery_partner", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/deliveries", (req, res) => {
    db.query("SELECT * FROM delivery", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/reviews", (req, res) => {
    db.query("SELECT * FROM review", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// =========================
// SEARCH
// =========================

app.get("/foods/search", (req, res) => {
    const name = req.query.name || "";

    const sql = `
        SELECT *
        FROM food_item
        WHERE food_name LIKE ?
    `;

    db.query(sql, [`%${name}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/restaurants/search", (req, res) => {
    const name = req.query.name || "";

    const sql = `
        SELECT *
        FROM restaurant
        WHERE restaurant_name LIKE ?
    `;

    db.query(sql, [`%${name}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/foods/category/:id", (req, res) => {
    const categoryId = req.params.id;

    const sql = `
        SELECT *
        FROM food_item
        WHERE category_id = ?
    `;

    db.query(sql, [categoryId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// =========================
// ORDER DETAILS
// =========================

app.get("/orders/:id", (req, res) => {
    const orderId = req.params.id;

    const sql = `
        SELECT o.*, c.customer_name, r.restaurant_name
        FROM orders o
        JOIN customer c ON o.customer_id = c.customer_id
        JOIN restaurant r ON o.restaurant_id = r.restaurant_id
        WHERE o.order_id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(results[0]);
    });
});

app.get("/orders/:id/items", (req, res) => {
    const orderId = req.params.id;

    const sql = `
        SELECT oi.*, f.food_name
        FROM order_item oi
        JOIN food_item f ON oi.food_id = f.food_id
        WHERE oi.order_id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/orders/:id/delivery", (req, res) => {
    const orderId = req.params.id;

    const sql = `
        SELECT d.*, dp.partner_name, dp.phone, dp.vehicle_number
        FROM delivery d
        JOIN delivery_partner dp
        ON d.partner_id = dp.partner_id
        WHERE d.order_id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/orders/:id/payment", (req, res) => {
    const orderId = req.params.id;

    const sql = `
        SELECT *
        FROM payment
        WHERE order_id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/orders/:id/summary", (req, res) => {
    const orderId = req.params.id;

    const sql = `
        SELECT
            o.order_id,
            c.customer_name,
            r.restaurant_name,
            o.order_date,
            o.total_amount,
            o.order_status,
            o.delivery_address,
            p.payment_method,
            p.payment_status,
            d.delivery_status,
            dp.partner_name
        FROM orders o
        JOIN customer c
            ON o.customer_id = c.customer_id
        JOIN restaurant r
            ON o.restaurant_id = r.restaurant_id
        LEFT JOIN payment p
            ON o.order_id = p.order_id
        LEFT JOIN delivery d
            ON o.order_id = d.order_id
        LEFT JOIN delivery_partner dp
            ON d.partner_id = dp.partner_id
        WHERE o.order_id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(results[0]);
    });
});


// =========================
// CUSTOMER DETAILS
// =========================

app.get("/customers/:id/orders", (req, res) => {
    const customerId = req.params.id;

    const sql = `
        SELECT o.*, r.restaurant_name
        FROM orders o
        JOIN restaurant r
            ON o.restaurant_id = r.restaurant_id
        WHERE o.customer_id = ?
    `;

    db.query(sql, [customerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/customers/:id/reviews", (req, res) => {
    const customerId = req.params.id;

    const sql = `
        SELECT rv.*, r.restaurant_name
        FROM review rv
        JOIN restaurant r
            ON rv.restaurant_id = r.restaurant_id
        WHERE rv.customer_id = ?
    `;

    db.query(sql, [customerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// =========================
// RESTAURANT DETAILS
// =========================

app.get("/restaurants/:id/reviews", (req, res) => {
    const restaurantId = req.params.id;

    const sql = `
        SELECT rv.*, c.customer_name
        FROM review rv
        JOIN customer c
            ON rv.customer_id = c.customer_id
        WHERE rv.restaurant_id = ?
    `;

    db.query(sql, [restaurantId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/restaurants/:id/foods", (req, res) => {
    const restaurantId = req.params.id;

    const sql = `
        SELECT f.*, c.category_name
        FROM food_item f
        JOIN category c
            ON f.category_id = c.category_id
        WHERE f.restaurant_id = ?
    `;

    db.query(sql, [restaurantId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// =========================
// POST - CREATE DATA
// =========================

app.post("/customers", (req, res) => {
    const {
        customer_name,
        email,
        phone,
        address,
        city
    } = req.body;

    const sql = `
        INSERT INTO customer
        (customer_name, email, phone, address, city)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [customer_name, email, phone, address, city],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Customer created successfully",
                customer_id: result.insertId
            });
        }
    );
});


app.post("/restaurants", (req, res) => {
    const {
        restaurant_name,
        address,
        city,
        phone,
        rating
    } = req.body;

    const sql = `
        INSERT INTO restaurant
        (restaurant_name, address, city, phone, rating)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [restaurant_name, address, city, phone, rating],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Restaurant created successfully",
                restaurant_id: result.insertId
            });
        }
    );
});


app.post("/foods", (req, res) => {
    const {
        restaurant_id,
        category_id,
        food_name,
        price,
        availability
    } = req.body;

    const sql = `
        INSERT INTO food_item
        (restaurant_id, category_id, food_name, price, availability)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            restaurant_id,
            category_id,
            food_name,
            price,
            availability
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Food item created successfully",
                food_id: result.insertId
            });
        }
    );
});


app.post("/orders", (req, res) => {
    const {
        customer_id,
        restaurant_id,
        total_amount,
        order_status,
        delivery_address
    } = req.body;

    const sql = `
        INSERT INTO orders
        (customer_id, restaurant_id, total_amount, order_status, delivery_address)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customer_id,
            restaurant_id,
            total_amount,
            order_status || "PLACED",
            delivery_address
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Order created successfully",
                order_id: result.insertId
            });
        }
    );
});


app.post("/order-items", (req, res) => {
    const {
        order_id,
        food_id,
        quantity,
        unit_price,
        subtotal
    } = req.body;

    const sql = `
        INSERT INTO order_item
        (order_id, food_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            order_id,
            food_id,
            quantity,
            unit_price,
            subtotal
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Order item created successfully",
                order_item_id: result.insertId
            });
        }
    );
});


app.post("/payments", (req, res) => {
    const {
        order_id,
        amount,
        payment_method,
        payment_status
    } = req.body;

    const sql = `
        INSERT INTO payment
        (order_id, amount, payment_method, payment_status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            order_id,
            amount,
            payment_method,
            payment_status || "PENDING"
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Payment created successfully",
                payment_id: result.insertId
            });
        }
    );
});


app.post("/delivery-partners", (req, res) => {
    const {
        partner_name,
        phone,
        vehicle_number,
        availability_status
    } = req.body;

    const sql = `
        INSERT INTO delivery_partner
        (partner_name, phone, vehicle_number, availability_status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            partner_name,
            phone,
            vehicle_number,
            availability_status || "AVAILABLE"
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Delivery partner created successfully",
                partner_id: result.insertId
            });
        }
    );
});


app.post("/deliveries", (req, res) => {
    const {
        order_id,
        partner_id,
        pickup_time,
        delivery_time,
        delivery_status
    } = req.body;

    const sql = `
        INSERT INTO delivery
        (order_id, partner_id, pickup_time, delivery_time, delivery_status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            order_id,
            partner_id,
            pickup_time || null,
            delivery_time || null,
            delivery_status || "ASSIGNED"
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Delivery created successfully",
                delivery_id: result.insertId
            });
        }
    );
});


app.post("/reviews", (req, res) => {
    const {
        customer_id,
        restaurant_id,
        order_id,
        rating,
        comments
    } = req.body;

    const sql = `
        INSERT INTO review
        (customer_id, restaurant_id, order_id, rating, comments)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customer_id,
            restaurant_id,
            order_id,
            rating,
            comments
        ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Review added successfully",
                review_id: result.insertId
            });
        }
    );
});


// =========================
// PUT - UPDATE DATA
// =========================

app.put("/orders/:id", (req, res) => {
    const orderId = req.params.id;
    const { order_status } = req.body;

    const sql = `
        UPDATE orders
        SET order_status = ?
        WHERE order_id = ?
    `;

    db.query(
        sql,
        [order_status, orderId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Order status updated successfully"
            });
        }
    );
});


app.put("/foods/:id", (req, res) => {
    const foodId = req.params.id;
    const {
        price,
        availability
    } = req.body;

    const sql = `
        UPDATE food_item
        SET price = ?, availability = ?
        WHERE food_id = ?
    `;

    db.query(
        sql,
        [price, availability, foodId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Food item updated successfully"
            });
        }
    );
});


app.put("/payments/:id", (req, res) => {
    const paymentId = req.params.id;
    const { payment_status } = req.body;

    const sql = `
        UPDATE payment
        SET payment_status = ?
        WHERE payment_id = ?
    `;

    db.query(
        sql,
        [payment_status, paymentId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Payment status updated successfully"
            });
        }
    );
});


app.put("/deliveries/:id", (req, res) => {
    const deliveryId = req.params.id;
    const { delivery_status } = req.body;

    const sql = `
        UPDATE delivery
        SET delivery_status = ?
        WHERE delivery_id = ?
    `;

    db.query(
        sql,
        [delivery_status, deliveryId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Delivery status updated successfully"
            });
        }
    );
});


// =========================
// DELETE
// =========================

app.delete("/reviews/:id", (req, res) => {
    const reviewId = req.params.id;

    const sql = `
        DELETE FROM review
        WHERE review_id = ?
    `;

    db.query(
        sql,
        [reviewId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Review deleted successfully"
            });
        }
    );
});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`FoodRush Backend running on port ${PORT}`);
});
