const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   BOOKING SCHEMA
========================= */

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    program: {
        type: String,
        required: true,
        trim: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    message: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
        default: "Pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
    res.send("IRONFIT GYM Backend is running! 💪");
});

/* =========================
   CREATE BOOKING
========================= */

app.post("/api/bookings", async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            program,
            date,
            time,
            message
        } = req.body;

        if (!name || !phone || !email || !program || !date || !time) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }

        const booking = new Booking({
            name,
            phone,
            email,
            program,
            date,
            time,
            message
        });

        await booking.save();

        res.status(201).json({
            message: "Booking created successfully!",
            booking
        });

    } catch (error) {
        console.error("Booking error:", error);

        res.status(500).json({
            message: "Failed to create booking."
        });
    }
});

/* =========================
   GET ALL BOOKINGS
========================= */

app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {
        console.error("Get bookings error:", error);

        res.status(500).json({
            message: "Failed to get bookings."
        });
    }
});

/* =========================
   CHECK BOOKING STATUS
========================= */

app.get("/api/bookings/status", async (req, res) => {
    try {
        const { email, phone } = req.query;

        if (!email || !phone) {
            return res.status(400).json({
                message: "Email and phone are required."
            });
        }

        const booking = await Booking.findOne({
            email: email.trim(),
            phone: phone.trim()
        }).sort({ createdAt: -1 });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        res.json({
            name: booking.name,
            program: booking.program,
            date: booking.date,
            time: booking.time,
            status: booking.status || "Pending"
        });

    } catch (error) {
        console.error("Booking status error:", error);

        res.status(500).json({
            message: "Failed to check booking status."
        });
    }
});

/* =========================
   UPDATE BOOKING STATUS
========================= */

app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status."
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        res.json({
            message: "Status updated successfully!",
            booking
        });

    } catch (error) {
        console.error("Update status error:", error);

        res.status(500).json({
            message: "Failed to update status."
        });
    }
});

/* =========================
   DELETE BOOKING
========================= */

app.delete("/api/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(
            req.params.id
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        res.json({
            message: "Booking deleted successfully!"
        });

    } catch (error) {
        console.error("Delete booking error:", error);

        res.status(500).json({
            message: "Failed to delete booking."
        });
    }
});

/* =========================
   MONGODB CONNECTION
========================= */

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully! ✅");

        app.listen(PORT, () => {
            console.log(
                `IRONFIT GYM server running at http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });