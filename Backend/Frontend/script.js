const API_URL = "http://localhost:5000";

// Load restaurants
function loadRestaurants() {
    fetch(`${API_URL}/restaurants`)
        .then(response => response.json())
        .then(restaurants => {

            const restaurantList =
                document.getElementById("restaurantList");

            restaurantList.innerHTML = "";

            restaurants.forEach(restaurant => {

                restaurantList.innerHTML += `
                    <div class="card">
                        <h3>${restaurant.restaurant_name}</h3>
                        <p>📍 ${restaurant.address}</p>
                        <p>🏙️ ${restaurant.city}</p>
                        <p>⭐ Rating: ${restaurant.rating}</p>
                    </div>
                `;

            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}


// Load food items
function loadFoods() {
    fetch(`${API_URL}/foods`)
        .then(response => response.json())
        .then(foods => {

            const foodList =
                document.getElementById("foodList");

            foodList.innerHTML = "";

            foods.forEach(food => {

                foodList.innerHTML += `
                    <div class="card">
                        <h3>${food.food_name}</h3>
                        <p>💰 Price: ₹${food.price}</p>
                        <p>
                            Availability:
                            ${food.availability ? "Available" : "Not Available"}
                        </p>
                    </div>
                `;

            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// Search restaurants
function searchRestaurants() {
    const name = document.getElementById("restaurantSearch").value;

    fetch(`${API_URL}/restaurants/search?name=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(restaurants => {

            const restaurantList =
                document.getElementById("restaurantList");

            restaurantList.innerHTML = "";

            restaurants.forEach(restaurant => {

               restaurantList.innerHTML += `
    <div class="card">
        <h3>${restaurant.restaurant_name}</h3>
        <p>📍 ${restaurant.address}</p>
        <p>🏙️ ${restaurant.city}</p>
        <p>⭐ Rating: ${restaurant.rating}</p>

        <button onclick="viewRestaurantMenu(${restaurant.restaurant_id})">
            View Menu
        </button>
    </div>
`;

            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// Search food items
function searchFoods() {
    const name = document.getElementById("foodSearch").value;

    fetch(`${API_URL}/foods/search?name=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(foods => {

            const foodList =
                document.getElementById("foodList");

            foodList.innerHTML = "";

            foods.forEach(food => {

                foodList.innerHTML += `
                    <div class="card">
                        <h3>${food.food_name}</h3>
                        <p>🍴 Restaurant: ${food.restaurant_name}</p>
                        <p>📂 Category: ${food.category_name}</p>
                        <p>💰 Price: ₹${food.price}</p>
                        <p>
                            Availability:
                            ${food.availability ? "Available" : "Not Available"}
                        </p>
                    </div>
                `;

            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// View food menu of a restaurant
function viewRestaurantMenu(restaurantId) {

    fetch(`${API_URL}/restaurants/${restaurantId}/foods`)
        .then(response => response.json())
        .then(foods => {

            const foodList =
                document.getElementById("foodList");

            foodList.innerHTML = "";

            foods.forEach(food => {

                foodList.innerHTML += `
                    <div class="card">
                        <h3>${food.food_name}</h3>
                        <p>📂 Category: ${food.category_name}</p>
                        <p>💰 Price: ₹${food.price}</p>
                        <p>
                            Availability:
                            ${food.availability ? "Available" : "Not Available"}
                        </p>
                    </div>
                `;

            });

            // Scroll to Food Menu
            document.getElementById("foodList").scrollIntoView({
                behavior: "smooth"
            });

        })
        .catch(error => {
            console.error("Error:", error);
        });
}
// View order details, items, payment and delivery
function viewOrder() {

    const orderId =
        document.getElementById("orderId").value;

    const orderDetails =
        document.getElementById("orderDetails");

    const orderItems =
        document.getElementById("orderItems");

    const paymentDetails =
        document.getElementById("paymentDetails");

    const deliveryDetails =
        document.getElementById("deliveryDetails");

    if (!orderId) {
        orderDetails.innerHTML =
            "<p>Please enter an Order ID.</p>";

        orderItems.innerHTML = "";
        paymentDetails.innerHTML = "";
        deliveryDetails.innerHTML = "";
        return;
    }

    // 1. Get order details
    fetch(`${API_URL}/orders/${orderId}`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Order not found");
            }

            return response.json();
        })
        .then(order => {

            orderDetails.innerHTML = `
                <div class="card">
                    <h3>Order #${order.order_id}</h3>

                    <p>👤 Customer: ${order.customer_name}</p>

                    <p>🍴 Restaurant: ${order.restaurant_name}</p>

                    <p>📅 Order Date: ${order.order_date}</p>

                    <p>💰 Total Amount: ₹${order.total_amount}</p>

                    <p>📦 Status: ${order.order_status}</p>

                    <p>📍 Delivery Address: ${order.delivery_address}</p>
                </div>
            `;

            // 2. Get order items
            return fetch(`${API_URL}/orders/${orderId}/items`);
        })
        .then(response => response.json())
        .then(items => {

            if (items.length === 0) {

                orderItems.innerHTML =
                    "<p>No food items found for this order.</p>";

            } else {

                orderItems.innerHTML = `
                    <h3>Food Items</h3>
                `;

                items.forEach(item => {

                    orderItems.innerHTML += `
                        <div class="card">
                            <h3>${item.food_name}</h3>

                            <p>🔢 Quantity: ${item.quantity}</p>

                            <p>💰 Unit Price: ₹${item.unit_price}</p>

                            <p>💵 Subtotal: ₹${item.subtotal}</p>
                        </div>
                    `;

                });
            }

            // 3. Get payment details
            return fetch(`${API_URL}/orders/${orderId}/payment`);
        })
        .then(response => {

            if (!response.ok) {
                throw new Error("Payment details not found");
            }

            return response.json();
        })
        .then(payment => {

            paymentDetails.innerHTML = `
                <h3>Payment Details</h3>

                <div class="card">
                    <p>💳 Payment Method: ${payment.payment_method}</p>

                    <p>💰 Amount: ₹${payment.amount}</p>

                    <p>📊 Payment Status: ${payment.payment_status}</p>

                    <p>📅 Payment Date: ${payment.payment_date}</p>
                </div>
            `;

            // 4. Get delivery details
            return fetch(`${API_URL}/orders/${orderId}/delivery`);
        })
        .then(response => {

            if (!response.ok) {
                throw new Error("Delivery details not found");
            }

            return response.json();
        })
        .then(delivery => {

            deliveryDetails.innerHTML = `
                <h3>Delivery Details</h3>

                <div class="card">
                    <p>🚴 Delivery Partner: ${delivery.partner_name}</p>

                    <p>📞 Phone: ${delivery.phone}</p>

                    <p>🛵 Vehicle: ${delivery.vehicle_number}</p>

                    <p>📦 Delivery Status: ${delivery.delivery_status}</p>
                </div>
            `;
        })
        .catch(error => {

            orderDetails.innerHTML = `
                <div class="card">
                    <p>❌ Order not found.</p>
                </div>
            `;

            orderItems.innerHTML = "";
            paymentDetails.innerHTML = "";
            deliveryDetails.innerHTML = "";

            console.error("Error:", error);
        });
}
// View all orders of a customer
function viewCustomerOrders() {

    const customerId =
        document.getElementById("customerId").value;

    const customerOrders =
        document.getElementById("customerOrders");

    if (!customerId) {
        customerOrders.innerHTML =
            "<p>Please enter a Customer ID.</p>";
        return;
    }

    fetch(`${API_URL}/customers/${customerId}/orders`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load customer orders");
            }

            return response.json();
        })
        .then(orders => {

            if (orders.length === 0) {

                customerOrders.innerHTML =
                    "<p>No orders found for this customer.</p>";

                return;
            }

            customerOrders.innerHTML = `
                <h3>Customer Orders</h3>
            `;

            orders.forEach(order => {

                customerOrders.innerHTML += `
                    <div class="card">

                        <h3>Order #${order.order_id}</h3>

                        <p>🍴 Restaurant: ${order.restaurant_name}</p>

                        <p>📅 Order Date: ${order.order_date}</p>

                        <p>💰 Amount: ₹${order.total_amount}</p>

                        <p>📦 Status: ${order.order_status}</p>

                        <p>📍 Delivery Address: ${order.delivery_address}</p>

                    </div>
                `;

            });
        })
        .catch(error => {

            customerOrders.innerHTML = `
                <div class="card">
                    <p>❌ Unable to load customer orders.</p>
                </div>
            `;

            console.error("Error:", error);
        });
}
// View all reviews written by a customer
function viewCustomerReviews() {

    const customerId =
        document.getElementById("reviewCustomerId").value;

    const customerReviews =
        document.getElementById("customerReviews");

    if (!customerId) {
        customerReviews.innerHTML =
            "<p>Please enter a Customer ID.</p>";
        return;
    }

    fetch(`${API_URL}/customers/${customerId}/reviews`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load customer reviews");
            }

            return response.json();
        })
        .then(reviews => {

            if (reviews.length === 0) {

                customerReviews.innerHTML =
                    "<p>No reviews found for this customer.</p>";

                return;
            }

            customerReviews.innerHTML = `
                <h3>Customer Reviews</h3>
            `;

            reviews.forEach(review => {

                customerReviews.innerHTML += `
                    <div class="card">

                        <h3>${review.restaurant_name}</h3>

                        <p>🧾 Order ID: ${review.order_id}</p>

                        <p>⭐ Rating: ${review.rating}/5</p>

                        <p>💬 ${review.comments}</p>

                        <p>📅 Review Date: ${review.review_date}</p>

                    </div>
                `;

            });
        })
        .catch(error => {

            customerReviews.innerHTML = `
                <div class="card">
                    <p>❌ Unable to load customer reviews.</p>
                </div>
            `;

            console.error("Error:", error);
        });
}
// View all reviews for a restaurant
function viewRestaurantReviews() {

    const restaurantId =
        document.getElementById("reviewRestaurantId").value;

    const restaurantReviews =
        document.getElementById("restaurantReviews");

    if (!restaurantId) {
        restaurantReviews.innerHTML =
            "<p>Please enter a Restaurant ID.</p>";
        return;
    }

    fetch(`${API_URL}/restaurants/${restaurantId}/reviews`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load restaurant reviews");
            }

            return response.json();
        })
        .then(reviews => {

            if (reviews.length === 0) {

                restaurantReviews.innerHTML =
                    "<p>No reviews found for this restaurant.</p>";

                return;
            }

            restaurantReviews.innerHTML = `
                <h3>Restaurant Reviews</h3>
            `;

            reviews.forEach(review => {

                restaurantReviews.innerHTML += `
                    <div class="card">

                        <h3>👤 ${review.customer_name}</h3>

                        <p>🧾 Order ID: ${review.order_id}</p>

                        <p>⭐ Rating: ${review.rating}/5</p>

                        <p>💬 ${review.comments}</p>

                        <p>📅 Review Date: ${review.review_date}</p>

                    </div>
                `;

            });
        })
        .catch(error => {

            restaurantReviews.innerHTML = `
                <div class="card">
                    <p>❌ Unable to load restaurant reviews.</p>
                </div>
            `;

            console.error("Error:", error);
        });
}
// Place a new order
function placeNewOrder() {

    const customerId =
        document.getElementById("newOrderCustomerId").value;

    const restaurantId =
        document.getElementById("newOrderRestaurantId").value;

    const totalAmount =
        document.getElementById("newOrderAmount").value;

    const deliveryAddress =
        document.getElementById("newOrderAddress").value;

    const result =
        document.getElementById("newOrderResult");

    // Check required fields
    if (!customerId || !restaurantId || !totalAmount || !deliveryAddress) {

        result.innerHTML = `
            <div class="card">
                <p>⚠️ Please fill in all fields.</p>
            </div>
        `;

        return;
    }

    // Send order to backend
    fetch(`${API_URL}/orders`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            customer_id: Number(customerId),
            restaurant_id: Number(restaurantId),
            total_amount: Number(totalAmount),
            order_status: "PLACED",
            delivery_address: deliveryAddress
        })

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to place order");
        }

        return response.json();
    })
    .then(data => {

        result.innerHTML = `
            <div class="card">

                <h3>✅ Order Placed Successfully!</h3>

                <p>🧾 Order ID: ${data.order_id}</p>

                <p>💰 Amount: ₹${totalAmount}</p>

                <p>📦 Status: PLACED</p>

            </div>
        `;

        // Clear form
        document.getElementById("newOrderCustomerId").value = "";
        document.getElementById("newOrderRestaurantId").value = "";
        document.getElementById("newOrderAmount").value = "";
        document.getElementById("newOrderAddress").value = "";

    })
    .catch(error => {

        result.innerHTML = `
            <div class="card">

                <p>❌ Failed to place order.</p>

            </div>
        `;

        console.error("Error:", error);
    });
}
// Update order status
function updateOrderStatus() {

    const orderId =
        document.getElementById("updateOrderId").value;

    const status =
        document.getElementById("updateOrderStatus").value;

    const result =
        document.getElementById("updateOrderResult");

    if (!orderId) {

        result.innerHTML = `
            <div class="card">
                <p>⚠️ Please enter an Order ID.</p>
            </div>
        `;

        return;
    }

    fetch(`${API_URL}/orders/${orderId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            order_status: status
        })

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to update order status");
        }

        return response.json();
    })
    .then(data => {

        result.innerHTML = `
            <div class="card">

                <h3>✅ Order Status Updated!</h3>

                <p>🧾 Order ID: ${orderId}</p>

                <p>📦 New Status: ${status}</p>

            </div>
        `;

        document.getElementById("updateOrderId").value = "";

    })
    .catch(error => {

        result.innerHTML = `
            <div class="card">

                <p>❌ Failed to update order status.</p>

            </div>
        `;

        console.error("Error:", error);
    });
}
// Update food price and availability
function updateFood() {

    const foodId =
        document.getElementById("updateFoodId").value;

    const price =
        document.getElementById("updateFoodPrice").value;

    const availability =
        document.getElementById("updateFoodAvailability").value;

    const result =
        document.getElementById("updateFoodResult");

    if (!foodId || !price) {

        result.innerHTML = `
            <div class="card">
                <p>⚠️ Please enter Food ID and Price.</p>
            </div>
        `;

        return;
    }

    fetch(`${API_URL}/foods/${foodId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            price: Number(price),
            availability: availability === "true"
        })

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to update food");
        }

        return response.json();
    })
    .then(data => {

        result.innerHTML = `
            <div class="card">

                <h3>✅ Food Updated Successfully!</h3>

                <p>🍴 Food ID: ${foodId}</p>

                <p>💰 New Price: ₹${price}</p>

                <p>
                    📦 Availability:
                    ${availability === "true"
                        ? "Available"
                        : "Not Available"}
                </p>

            </div>
        `;

        document.getElementById("updateFoodId").value = "";
        document.getElementById("updateFoodPrice").value = "";

    })
    .catch(error => {

        result.innerHTML = `
            <div class="card">
                <p>❌ Failed to update food.</p>
            </div>
        `;

        console.error("Error:", error);
    });
}
// Update payment status
function updatePaymentStatus() {

    const paymentId =
        document.getElementById("updatePaymentId").value;

    const status =
        document.getElementById("updatePaymentStatus").value;

    const result =
        document.getElementById("updatePaymentResult");

    if (!paymentId) {

        result.innerHTML = `
            <div class="card">
                <p>⚠️ Please enter a Payment ID.</p>
            </div>
        `;

        return;
    }

    fetch(`${API_URL}/payments/${paymentId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            payment_status: status
        })

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to update payment");
        }

        return response.json();
    })
    .then(data => {

        result.innerHTML = `
            <div class="card">

                <h3>✅ Payment Status Updated!</h3>

                <p>💳 Payment ID: ${paymentId}</p>

                <p>📊 New Status: ${status}</p>

            </div>
        `;

        document.getElementById("updatePaymentId").value = "";

    })
    .catch(error => {

        result.innerHTML = `
            <div class="card">

                <p>❌ Failed to update payment.</p>

            </div>
        `;

        console.error("Error:", error);
    });
}
// Update delivery status
function updateDeliveryStatus() {

    const deliveryId =
        document.getElementById("updateDeliveryId").value;

    const status =
        document.getElementById("updateDeliveryStatus").value;

    const result =
        document.getElementById("updateDeliveryResult");

    if (!deliveryId) {

        result.innerHTML = `
            <div class="card">
                <p>⚠️ Please enter a Delivery ID.</p>
            </div>
        `;

        return;
    }

    fetch(`${API_URL}/deliveries/${deliveryId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            delivery_status: status
        })

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to update delivery");
        }

        return response.json();
    })
    .then(data => {

        result.innerHTML = `
            <div class="card">

                <h3>✅ Delivery Status Updated!</h3>

                <p>🚴 Delivery ID: ${deliveryId}</p>

                <p>📦 New Status: ${status}</p>

            </div>
        `;

        document.getElementById("updateDeliveryId").value = "";

    })
    .catch(error => {

        result.innerHTML = `
            <div class="card">

                <p>❌ Failed to update delivery.</p>

            </div>
        `;

        console.error("Error:", error);
    });
}
// Add a new review
function addReview() {

    const customerId =
        document.getElementById("newReviewCustomerId").value;

    const restaurantId =
        document.getElementById("newReviewRestaurantId").value;

    const orderId =
        document.getElementById("newReviewOrderId").value;

    const rating =
        document.getElementById("newReviewRating").value;

    const comments =
        document.getElementById("newReviewComments").value;

    const result =
        document.getElementById("addReviewResult");

    if (!customerId || !restaurantId || !orderId || !rating || !comments) {

        result.innerHTML = `
            <div class="card">
                <p>⚠️ Please fill in all fields.</p>
            </div>
        `;

        return;
    }

    if (rating < 1 || rating > 5) {

        result.innerHTML = `
            <div class="card">
                <p>⚠️ Rating must be between 1 and 5.</p>
            </div>
        `;

        return;
    }

    fetch(`${API_URL}/reviews`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            customer_id: Number(customerId),
            restaurant_id: Number(restaurantId),
            order_id: Number(orderId),
            rating: Number(rating),
            comments: comments
        })

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to add review");
        }

        return response.json();
    })
    .then(data => {

        result.innerHTML = `
            <div class="card">

                <h3>✅ Review Added Successfully!</h3>

                <p>⭐ Rating: ${rating}/5</p>

                <p>💬 ${comments}</p>

            </div>
        `;

        document.getElementById("newReviewCustomerId").value = "";
        document.getElementById("newReviewRestaurantId").value = "";
        document.getElementById("newReviewOrderId").value = "";
        document.getElementById("newReviewRating").value = "";
        document.getElementById("newReviewComments").value = "";

    })
    .catch(error => {

        result.innerHTML = `
            <div class="card">

                <p>❌ Failed to add review.</p>

            </div>
        `;

        console.error("Error:", error);
    });
}
// Delete a review
function deleteReview() {

    const reviewId =
        document.getElementById("deleteReviewId").value;

    const result =
        document.getElementById("deleteReviewResult");

    if (!reviewId) {

        result.innerHTML = `
            <div class="card">
                <p>⚠️ Please enter a Review ID.</p>
            </div>
        `;

        return;
    }

    fetch(`${API_URL}/reviews/${reviewId}`, {

        method: "DELETE"

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to delete review");
        }

        return response.json();
    })
    .then(data => {

        result.innerHTML = `
            <div class="card">

                <h3>✅ Review Deleted Successfully!</h3>

                <p>🗑️ Review ID: ${reviewId}</p>

            </div>
        `;

        document.getElementById("deleteReviewId").value = "";

    })
    .catch(error => {

        result.innerHTML = `
            <div class="card">

                <p>❌ Failed to delete review.</p>

            </div>
        `;

        console.error("Error:", error);
    });
}