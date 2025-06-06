import { Router} from "express"
import { createBooking, deleteBookingById, getBooking, getBookingById, updateBooking } from "../../controllers/booking-controllers/booking.controller.js"


const router=Router()

router.post("/booking", createBooking)
router.put("/booking/:id", updateBooking)
router.get("/booking", getBooking )
router.get("/booking/:id", getBookingById )
router.get("/booking/id", deleteBookingById )

export default router