import { Request, Response } from "express";
import Stripe from "stripe";
import Booking from "../../models/booking-model/booking.model.js";
import dotenv from 'dotenv'





// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16"
// });

const stripe= new Stripe(process.env.STRIPE_PRIVATE_KEY!,{
     apiVersion: "2023-10-16" as Stripe.LatestApiVersion
})

export const createSession = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.body;

    const booking = await Booking.findByPk(booking_id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

  
    const price = Number(booking.booking_price);

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid booking price" });
    }

    const unitAmount = Math.round(price * 100); 

    console.log("Creating Stripe session with:", {
      booking_id: booking.id,
      party_length: booking.party_length,
      price,
      unitAmount,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Terrace Booking",
              description: `Booking for ${booking.party_length} persons`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/success?bookingId=${booking.id}`,
      cancel_url: `http://localhost:3000/cancel`, //recomendado puerto 3000 esto se manejara desde el front
      metadata: {
        bookingId: booking.id,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// catch(error:any){
//     console.error("Webhook signature error:", err.message)
// }

// Webhook
// export const handleStripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"];
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
//   } catch (err: any) {
//     console.error("Webhook signature error:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;
//     const bookingId = session.metadata?.bookingId;

//     if (bookingId) {
//       await Booking.update(
//         {
//           is_paid: true,
//           payment_id: session.payment_intent?.toString() ?? null,
//         },
//         {
//           where: { id: bookingId },
//         }
//       );
//     }
//   }

//   res.status(200).send("Webhook received");
// };