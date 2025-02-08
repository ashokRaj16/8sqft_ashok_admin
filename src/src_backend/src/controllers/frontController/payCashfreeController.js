import axios from "axios";
import pool from "../../config/db.js";

const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL;
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

export const createPayment = async (req, res) => {
    try {
      const { planId, orderAmount } = req.body;

        // Generate unique order_id
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const userId = req.userId;
  
      if (!userId || !planId || !orderId || !orderAmount) {
        return res.status(400).json({ error: "Invalid input data" });
      }
  
      await pool.execute(
        `INSERT INTO tbl_payment_transaction 
        (user_id, plan_id, order_id, order_amount, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, planId, orderId, orderAmount, "PENDING"]
      );
  
      await pool.execute(
        `INSERT INTO tbl_payment_history 
        (user_id, plan_id, order_id, order_amount, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, planId, orderId, orderAmount, "PENDING"]
      );
  
      const paymentData = {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${orderId}`,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.SERVER_BASE_URL}:${process.env.PORT}/api/v1/payment/response`,
        },
      };
  
      // Call Cashfree API
      const response = await axios.post(`${CASHFREE_BASE_URL}/orders`, paymentData, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
        },
      });
  
      const { payment_link } = response.data;
  
      if (payment_link) {
        // Update tbl_payment_transaction with payment link
        await pool.execute(
          `UPDATE tbl_payment_transaction SET payment_status = ?, updated_at = NOW() WHERE order_id = ?`,
          ["PENDING", orderId]
        );
  
        return res.status(200).json({ payment_link });
      } else {
        throw new Error("Failed to generate payment link");
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};
  
  export const paymentResponse = async (req, res) => {
    try {
      const { order_id, order_token } = req.query;
  
      if (!order_id || !order_token) {
        return res.status(400).send("Invalid payment response.");
      }
 
      await pool.execute(
        `UPDATE tbl_payment_transaction SET payment_status = ?, updated_at = NOW() WHERE order_id = ?`,
        ["SUCCESS", order_id]
      );
  
      await pool.execute(
        `UPDATE tbl_payment_history SET payment_status = ?, updated_at = NOW() WHERE order_id = ?`,
        ["SUCCESS", order_id]
      );
  
      res.send("Payment successful. Thank you!");
    } catch (error) {
      console.error("Error handling payment response:", error);
      res.status(500).send("Error processing payment response.");
    }
  };
  
  export const handleFailure = async (orderId) => {
    try {
      await pool.execute(
        `UPDATE tbl_payment_transaction SET payment_status = ?, updated_at = NOW() WHERE order_id = ?`,
        ["FAILED", orderId]
      );
  
      await pool.execute(
        `UPDATE tbl_payment_history SET payment_status = ?, updated_at = NOW() WHERE order_id = ?`,
        ["FAILED", orderId]
      );
    } catch (error) {
      console.error("Error updating failed transaction:", error);
    }
  };
  