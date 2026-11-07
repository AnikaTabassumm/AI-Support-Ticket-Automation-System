
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const { analyzeTicket } = require("./services/aiService");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      status: "success",
      message: "AI Support Automation API is running",
      database: "Connected",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Submit a support ticket
app.post("/api/tickets", async (req, res) => {
  try {
    const { customer_name, email, subject, message } = req.body;

    // Validate required fields
    if (!customer_name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Analyze ticket using Gemini
    const analysis = await analyzeTicket({ subject, message });

    // Save ticket and AI analysis
    const sql = `
      INSERT INTO tickets
      (customer_name, email, subject, message,
       category, priority, sentiment, suggested_reply)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      customer_name,
      email,
      subject,
      message,
      analysis.category,
      analysis.priority,
      analysis.sentiment,
      analysis.suggested_reply,
    ];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      status: "success",
      message: "Ticket submitted and analyzed successfully",
      ticket: {
        id: result.insertId,
        customer_name,
        email,
        subject,
        message,
        ...analysis,
        status: "Open",
      },
    });
  } catch (error) {
    console.error("Ticket submission error:", error.message);

    res.status(500).json({
      message: "Failed to process ticket",
    });
  }
});

// Get all tickets
app.get("/api/tickets", async (req, res) => {
  try {
    const [tickets] = await db.query(
      "SELECT * FROM tickets ORDER BY created_at DESC"
    );

    res.json(tickets);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to retrieve tickets" });
  }
});


// Update ticket status
app.patch("/api/tickets/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Open",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid ticket status",
      });
    }

    const [result] = await db.query(
      "UPDATE tickets SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json({
      status: "success",
      message: "Ticket status updated successfully",
    });
  } catch (error) {
    console.error("Status update error:", error.message);

    res.status(500).json({
      message: "Failed to update ticket status",
    });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
