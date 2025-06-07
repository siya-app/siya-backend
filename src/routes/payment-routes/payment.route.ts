import { Router } from "express";
import { createSession } from "../../controllers/payment-controllers/payment.controller.js";

const router= Router()

router.post("/create-checkout-session", createSession)
console.log("✅ Payment route file loaded!");
export default router