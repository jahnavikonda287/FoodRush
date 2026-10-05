const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("FoodRush Backend is Running!");
});

app.get("/test-db", (req, res) => {
    const sql = "SELECT 1 + 1 AS result";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/customers", (req, res) => {
    const sql = "SELECT * FROM customer";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all restaurants
app.get("/restaurants", (req, res) => {
    const sql = "SELECT * FROM restaurant";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all food items
app.get("/foods", (req, res) => {
    const sql = "SELECT * FROM food_item";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all categories
app.get("/categories", (req, res) => {
    const sql = "SELECT * FROM category";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all orders
app.get("/orders", (req, res) => {
    const sql = `
        SELECT
            o.order_id,
            c.customer_name,
            r.restaurant_name,
            o.order_date,
            o.total_amount,
            o.order_status,
            o.delivery_address
        FROM orders o
        JOIN customer c
            ON o.customer_id = c.customer_id
        JOIN restaurant r
            ON o.restaurant_id = r.restaurant_id
        ORDER BY o.order_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all order items
app.get("/order-items", (req, res) => {
    const sql = `
        SELECT
            oi.order_item_id,
            oi.order_id,
            f.food_name,
            oi.quantity,
            oi.unit_price,
            oi.subtotal
        FROM order_item oi
        JOIN food_item f
            ON oi.food_id = f.food_id
        ORDER BY oi.order_id, oi.order_item_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all payments
app.get("/payments", (req, res) => {
    const sql = `
        SELECT
            p.payment_id,
            p.order_id,
            c.customer_name,
            p.payment_date,
            p.amount,
            p.payment_method,
            p.payment_status
        FROM payment p
        JOIN orders o
            ON p.order_id = o.order_id
        JOIN customer c
            ON o.customer_id = c.customer_id
        ORDER BY p.payment_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all delivery partners
app.get("/delivery-partners", (req, res) => {
    const sql = "SELECT * FROM delivery_partner";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all deliveries
app.get("/deliveries", (req, res) => {
    const sql = `
        SELECT
            d.delivery_id,
            d.order_id,
            c.customer_name,
            dp.partner_name,
            dp.vehicle_number,
            d.pickup_time,
            d.delivery_time,
            d.delivery_status
        FROM delivery d
        JOIN orders o
            ON d.order_id = o.order_id
        JOIN customer c
            ON o.customer_id = c.customer_id
        JOIN delivery_partner dp
            ON d.partner_id = dp.partner_id
        ORDER BY d.delivery_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all reviews
app.get("/reviews", (req, res) => {
    const sql = `
        SELECT
            rv.review_id,
            c.customer_name,
            r.restaurant_name,
            rv.order_id,
            rv.rating,
            rv.comments,
            rv.review_date
        FROM review rv
        JOIN customer c
            ON rv.customer_id = c.customer_id
        JOIN restaurant r
            ON rv.restaurant_id = r.restaurant_id
        ORDER BY rv.review_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Add a new customer
app.post("/customers", (req, res) => {
    const { customer_name, email, phone, address, city } = req.body;

    const sql = `
        INSERT INTO customer
        (customer_name, email, phone, address, city)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [customer_name, email, phone, address, city],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Customer added successfully",
                customer_id: result.insertId
            });
        }
    );
});
// Add a new restaurant
app.post("/restaurants", (req, res) => {
    const { restaurant_name, address, city, phone, rating } = req.body;

    const sql = `
        INSERT INTO restaurant
        (restaurant_name, address, city, phone, rating)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [restaurant_name, address, city, phone, rating],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Restaurant added successfully",
                restaurant_id: result.insertId
            });
        }
    );
});
// Add a new food item
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
        [restaurant_id, category_id, food_name, price, availability],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Food item added successfully",
                food_id: result.insertId
            });
        }
    );
});
// Add a new order
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
            order_status,
            delivery_address
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Order added successfully",
                order_id: result.insertId
            });
        }
    );
});
// Add an item to an order
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
        [order_id, food_id, quantity, unit_price, subtotal],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Order item added successfully",
                order_item_id: result.insertId
            });
        }
    );
});
// Add a new payment
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
        [order_id, amount, payment_method, payment_status],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Payment added successfully",
                payment_id: result.insertId
            });
        }
    );
});
// Add a new delivery partner
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
        [partner_name, phone, vehicle_number, availability_status],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Delivery partner added successfully",
                partner_id: result.insertId
            });
        }
    );
});
// Add a new delivery
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
            pickup_time,
            delivery_time,
            delivery_status
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Delivery added successfully",
                delivery_id: result.insertId
            });
        }
    );
});
// Add a new review
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
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Review added successfully",
                review_id: result.insertId
            });
        }
    );
});
// Update order status
app.put("/orders/:id", (req, res) => {
    const { id } = req.params;
    const { order_status } = req.body;

    const sql = `
        UPDATE orders
        SET order_status = ?
        WHERE order_id = ?
    `;

    db.query(sql, [order_status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully"
        });
    });
});
// Update food item
app.put("/foods/:id", (req, res) => {
    const { id } = req.params;
    const { price, availability } = req.body;

    const sql = `
        UPDATE food_item
        SET price = ?, availability = ?
        WHERE food_id = ?
    `;

    db.query(sql, [price, availability, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        res.json({
            message: "Food item updated successfully"
        });
    });
});
// Update payment status
app.put("/payments/:id", (req, res) => {
    const { id } = req.params;
    const { payment_status } = req.body;

    const sql = `
        UPDATE payment
        SET payment_status = ?
        WHERE payment_id = ?
    `;

    db.query(sql, [payment_status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.json({
            message: "Payment status updated successfully"
        });
    });
});
// Update delivery status
app.put("/deliveries/:id", (req, res) => {
    const { id } = req.params;
    const { delivery_status } = req.body;

    const sql = `
        UPDATE delivery
        SET delivery_status = ?
        WHERE delivery_id = ?
    `;

    db.query(sql, [delivery_status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        res.json({
            message: "Delivery status updated successfully"
        });
    });
});
// Delete a review
app.delete("/reviews/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM review
        WHERE review_id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.json({
            message: "Review deleted successfully"
        });
    });
});
// Search food items by name
app.get("/foods/search", (req, res) => {
    const { name } = req.query;

    const sql = `
        SELECT
            f.food_id,
            f.food_name,
            r.restaurant_name,
            c.category_name,
            f.price,
            f.availability
        FROM food_item f
        JOIN restaurant r
            ON f.restaurant_id = r.restaurant_id
        JOIN category c
            ON f.category_id = c.category_id
        WHERE f.food_name LIKE ?
        ORDER BY f.food_name;
    `;

    db.query(sql, [`%${name}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// Search restaurants by name
app.get("/restaurants/search", (req, res) => {
    const { name } = req.query;

    const sql = `
        SELECT
            restaurant_id,
            restaurant_name,
            address,
            city,
            phone,
            rating
        FROM restaurant
        WHERE restaurant_name LIKE ?
        ORDER BY restaurant_name;
    `;

    db.query(sql, [`%${name}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/foods/category/:category_id", (req, res) => {
    const { category_id } = req.params;

    const sql = `
        SELECT
            f.food_id,
            f.food_name,
            r.restaurant_name,
            c.category_name,
            f.price,
            f.availability
        FROM food_item f
        JOIN restaurant r
            ON f.restaurant_id = r.restaurant_id
        JOIN category c
            ON f.category_id = c.category_id
        WHERE f.category_id = ?
        ORDER BY f.food_name;
    `;

    db.query(sql, [category_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/orders/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            o.order_id,
            c.customer_name,
            r.restaurant_name,
            o.order_date,
            o.total_amount,
            o.order_status,
            o.delivery_address
        FROM orders o
        JOIN customer c
            ON o.customer_id = c.customer_id
        JOIN restaurant r
            ON o.restaurant_id = r.restaurant_id
        WHERE o.order_id = ?;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(results[0]);
    });
});
app.get("/orders/:id/items", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            oi.order_item_id,
            oi.order_id,
            f.food_name,
            oi.quantity,
            oi.unit_price,
            oi.subtotal
        FROM order_item oi
        JOIN food_item f
            ON oi.food_id = f.food_id
        WHERE oi.order_id = ?
        ORDER BY oi.order_item_id;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/customers/:id/orders", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            o.order_id,
            r.restaurant_name,
            o.order_date,
            o.total_amount,
            o.order_status,
            o.delivery_address
        FROM orders o
        JOIN restaurant r
            ON o.restaurant_id = r.restaurant_id
        WHERE o.customer_id = ?
        ORDER BY o.order_id DESC;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/customers/:id/reviews", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            rv.review_id,
            r.restaurant_name,
            rv.order_id,
            rv.rating,
            rv.comments,
            rv.review_date
        FROM review rv
        JOIN restaurant r
            ON rv.restaurant_id = r.restaurant_id
        WHERE rv.customer_id = ?
        ORDER BY rv.review_id DESC;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/restaurants/:id/reviews", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            rv.review_id,
            c.customer_name,
            rv.order_id,
            rv.rating,
            rv.comments,
            rv.review_date
        FROM review rv
        JOIN customer c
            ON rv.customer_id = c.customer_id
        WHERE rv.restaurant_id = ?
        ORDER BY rv.review_id DESC;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/restaurants/:id/foods", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            f.food_id,
            f.food_name,
            c.category_name,
            f.price,
            f.availability
        FROM food_item f
        JOIN category c
            ON f.category_id = c.category_id
        WHERE f.restaurant_id = ?
        ORDER BY f.food_name;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/orders/:id/delivery", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            d.delivery_id,
            d.order_id,
            dp.partner_name,
            dp.phone,
            dp.vehicle_number,
            d.pickup_time,
            d.delivery_time,
            d.delivery_status
        FROM delivery d
        JOIN delivery_partner dp
            ON d.partner_id = dp.partner_id
        WHERE d.order_id = ?;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Delivery details not found"
            });
        }

        res.json(results[0]);
    });
});
app.get("/orders/:id/payment", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            p.payment_id,
            p.order_id,
            p.payment_date,
            p.amount,
            p.payment_method,
            p.payment_status
        FROM payment p
        WHERE p.order_id = ?;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Payment details not found"
            });
        }

        res.json(results[0]);
    });
});
app.get("/orders/:id/summary", (req, res) => {
    const { id } = req.params;

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
        WHERE o.order_id = ?;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(results[0]);
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`FoodRush Backend running on http://localhost:${PORT}`);
});
