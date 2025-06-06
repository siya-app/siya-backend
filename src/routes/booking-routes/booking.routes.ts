import { Router} from "express"
import { createBooking, getBooking, updateBooking } from "../../controllers/booking-controllers/booking.controller.js"


const router=Router()

router.post("/booking", createBooking)
router.put("/booking/:id", updateBooking)
router.get("/booking", getBooking )

export default router