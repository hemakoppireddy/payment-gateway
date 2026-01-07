import express from "express";
import { authenticateMerchant } from "../middleware/authMiddleware.js";
import { createPaymentService } from "../services/payment.service.js";
import { findPaymentById } from "../repositories/payment.repo.js";
import { apiError } from "../utils/errors.js";

const router = express.Router();

router.post("/", authenticateMerchant, async (req, res, next) => {
  try {
    const payment = await createPaymentService(req.body, req.merchant);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
});

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
