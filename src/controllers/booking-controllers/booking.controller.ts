import { ZodError } from "zod";
import Booking from "../../models/booking-model/booking.model.js";
import { bookingSchema } from "../../models/booking-model/zod/booking.schema.js";
import { Request, Response } from "express";
import { existsSync } from "fs";
import { error } from "console";


//this is a Post Route
//http://localhost:8080/booking
export const createBooking = async (req:Request, res:Response)=>{
    try {
        const validateData=bookingSchema.parse(req.body)

        const booking_price=validateData.booking_price??validateData.party_length * 1

        if (isNaN(booking_price) || booking_price <= 0) {
         throw new Error("Booking price must be a positive number");
        }

        const newBooking=await Booking.create({
            ...validateData,
            booking_price,
            is_paid: validateData.is_paid??false
        })
        return res.status(201).json(newBooking)
    } catch (error:any) {
        if (error instanceof ZodError){
            return res.status(400).json({error: "validation goes wrong", details: error.errors})
        }
        console.error(" Error creating booking:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

// this is a Put Route
//http://localhost:8080/booking/{booking_id}
export const updateBooking = async (req:Request, res:Response)=>{
    try{
        const bookingId=req.params.id
        const findBooking=await Booking.findByPk(bookingId)

        if(!findBooking){
            return res.status(404).json({error:"Booking not found"})
        }

        const validateData=bookingSchema.partial().parse(req.body) // partial takes zod schema in parts to update  

        const booking_price = validateData.booking_price?? (validateData.party_length? validateData.party_length*1 : findBooking.booking_price)

        await findBooking.update({
            ...validateData,
            booking_price, 
            is_paid:validateData.is_paid??findBooking.is_paid
        })
        return res.status(200).json(findBooking)
    }catch(error:any){
        if(error instanceof ZodError){
            return res.status(400).json({error: "Validation goes wrong", details:error.errors})
        }
        console.error("error Updating booking", error);
        return res.status(500).json({error:"Internal server error"})
    }

}

//this is a get route
//http://localhost:8080/booking/

export const getBooking= async(req:Request, res: Response)=>{
    try {
        const showAllBooking=await Booking.findAll()
        return res.status(200).json(showAllBooking)
    } catch (error:any) {
         if (error instanceof ZodError) {
            return res.status(500).json({ error: "Schema validation failed", details: error.errors })
        }
        console.error("error fetching booking", error);
        return res.status(500).json()
    }
}

//this is a Get{id} route
//http://localhost:8080/booking/{id}

export const getBookingById=async(req:Request, res:Response)=>{
    try {
        const {id}=bookingSchema.parse(req.params)
        const booking=await Booking.findByPk(id)
        if(!booking){
            return res.status(404).json({error:"booking doesn't exist"})
        }
        return res.status(200).json(booking)
    } catch (error:any) {
        if(error instanceof ZodError){
            return res.status(400).json({error:"invalid Id", details:error.errors})
        }
        console.error("error fetching booking", error)
        return res.status(500).json({error:"internal server error"})
    }
}

//this is a delete route
//http://localhost:8080/booking/{id}

export const deleteBookingById= async(req:Request, res:Response)=>{
    try {
        const {id}=bookingSchema.parse(req.params)
        const booking=await Booking.findByPk(id)

        if(!booking){
            return res.status(404).json({error:"booking doesn't exist"})
        }
        await booking.destroy()
        return res.status(200).json({message:"booking deleted successfully"})
    } catch (error:any) {
        if(error instanceof ZodError){
            return res.status(400).json({error:"invalid id", details:error.errors})
        }
        console.error("error deleting booking",error)
        return res.status(500).json({error:"internal server error"})
    }
}