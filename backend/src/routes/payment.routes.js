import express from "express";
import { authenticateMerchant } from "../middleware/authMiddleware.js";
import { createPaymentService } from "../services/payment.service.js";
import { findPaymentById } from "../repositories/payment.repo.js";
import { apiError } from "../utils/errors.js";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * Create payment (merchant API)
 */
router.post("/", authenticateMerchant, async (req, res, next) => {
  try {
    const payment = await createPaymentService(req.body, req.merchant);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
});

/**
 * ✅ LIST ALL PAYMENTS FOR MERCHANT (REQUIRED FOR DASHBOARD)
 */
router.get("/", authenticateMerchant, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM payments
      WHERE merchant_id = $1
      ORDER BY created_at DESC
      `,
      [req.merchant.id]
    );

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Get single payment
 */
router.get("/:payment_id", authenticateMerchant, async (req, res, next) => {
  try {
    const payment = await findPaymentById(req.params.payment_id);

    if (!payment || payment.merchant_id !== req.merchant.id) {
      throw apiError(404, "NOT_FOUND_ERROR", "Payment not found");
    }

    res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
});

export default router;
