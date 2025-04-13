import Razorpay from "razorpay";
import pool from "../../config/db.js";
import crypto from 'crypto';
import { badRequestResponse, successResponse, successWithDataResponse } from "../../utils/response.js";
import { readRecordDb } from "../../models/commonModel.js";
import { addDate } from "../../utils/commonHelper.js";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * ### ChECK PAYMENT MODE : ONLINE | OFFLINE
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const createPayment = async (req, res) => {
  try {

    
    const userId = req.userId;
    const { planId, orderAmount } = req.body;


    if (!planId || !orderAmount) {
      return badRequestResponse(res, false, "Plan Id and order amount is required with request.");
    }

    const [planDetails] = await readRecordDb('tbl_subscription_plans', undefined, ['plan_status = ? AND id = ?'], ['1', planId]);

    if(!planDetails) {
      return badRequestResponse(res, false, "No Plan details not found. Please enter correct plan id.");
    }
    // Calculate GST amount and total order amount
    const gstAmount = ((planDetails.plan_discounted_amount * planDetails.plan_gst_per) / 100);
    let newOrderAmount = parseFloat( planDetails.plan_discounted_amount + gstAmount ).toFixed(2);

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    const user_agent = req.headers['user-agent'] || '';
    const host_name = req.headers['host'] || "" ;

    await pool.execute(
      `INSERT INTO tbl_payment_transaction 
      (user_id, plan_id, order_id, order_amount, payment_status, user_agent, host_name, ip_address) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, planId, orderId, newOrderAmount,"PENDING", user_agent, host_name, ip_address]
    );

    await pool.execute(
      `INSERT INTO tbl_payment_history 
      (user_id, plan_id, order_id, order_amount, payment_status) 
      VALUES (?, ?, ?, ?, ?)`,
      [userId, planId, orderId, newOrderAmount, "PENDING"]
    );

    const options = {
      amount: Math.round(newOrderAmount * 100),
      currency: "INR",
      receipt: orderId,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      throw new Error("Failed to create Razorpay order");
    }


    // store this order to database.
    const response = await pool.execute(
      `UPDATE tbl_payment_transaction SET payment_status = ?, currency = ?, razorpay_order_id = ?, pay_create_json = ? WHERE order_id = ?`,
      [ order.status, order.currency, order.id, JSON.stringify(order), orderId]
    );

    let data = { 
      order: order,
      paymentLink: `https://rzp.io/i/${order.id}`,
      orderId: orderId
    }
    return successWithDataResponse(res, true, "Payment successfully initiated.", data);

  } catch (error) {
    console.error("Razorpay payment creation error:", error);
    return badRequestResponse(res, false, "Internal Server Error", error );
  }
};


// ###check for capture payment status 

// app.post("/api/payments/:paymentId/capture", 
export const capturePayment = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const amount = req.body.amount;

    const payment = razorpay.payments.capture(paymentId, amount);

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ error: "Failed to capture payment" + error });
  }
};


export const verifySignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, org_order_id, pay_res_json } = req.body;


    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment response" });
    }
    
    const [orderDetails] = await readRecordDb('tbl_payment_transaction', undefined, ['order_id = ?'], [ org_order_id ]);

    if(!orderDetails) {
      return badRequestResponse(res, false, "No payment transaction found. Please enter correct transaction details.");
    }

    if(orderDetails.razorpay_order_id !== razorpay_order_id) {
      return badRequestResponse(res, false, "Order details not match, please enter correct order id.");
    }
    
    const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
    

    if (generatedSignature !== razorpay_signature) {
      return badRequestResponse(res, false, "Invalid signature verification" );
    }
    
    const [planDetails] = await readRecordDb('tbl_subscription_plans', undefined, ['id = ?'], [ orderDetails.plan_id]);
    
    const currentDate = new Date();
    const start_date = currentDate;
    // const end_date = currentDate.addDays(planDetails.duration_days);
    const end_date = addDate(planDetails.duration_days, currentDate)

    // ### ADD PLAN START AND END DATE, //done
    const response = await pool.execute(
      `UPDATE tbl_payment_transaction SET payment_status = ?, razorpay_payment_id=?, pay_res_json = ?, plan_start_date = ?, plan_end_date = ?, payment_mode = ? WHERE order_id = ?`,
      ["SUCCESS", razorpay_payment_id, JSON.stringify(pay_res_json), start_date, end_date, "ONLINE", org_order_id]
    );

    await pool.execute(
      `UPDATE tbl_payment_history SET payment_status = ? WHERE order_id = ?`,
      ["SUCCESS", org_order_id]
    );

      return successResponse(res, true, "Payment successful!");
  } catch (error) {
    console.error("Error processing Razorpay payment response:", error);
    return badRequestResponse(res, false, "Internal Server Error.");
  }
};
