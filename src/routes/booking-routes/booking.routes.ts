import { Router} from "express"
import { createBooking, deleteBookingById, getBooking, getBookingById, updateBooking, getAllBookings} from "../../controllers/booking-controllers/booking.controller.js"
import { isTokenValid } from "../../middleware/auth.middleware.js"

const router=Router()

router.post("/booking",isTokenValid, createBooking)
router.put("/booking/:id",isTokenValid, updateBooking)
router.get("/booking",isTokenValid, getBooking )
router.get("/booking/:id",isTokenValid, getBookingById )
router.delete("/booking/id",isTokenValid, deleteBookingById )

router.get("/reserves", getAllBookings);

export default router