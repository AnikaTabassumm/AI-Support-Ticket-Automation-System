
"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  async function fetchTickets() {
    try {
      const response = await fetch(`${API_URL}/tickets`);

      if (!response.ok) throw new Error("Could not load tickets");

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError("Unable to connect to the backend.");
    }
  }

  async function handleStatusChange(ticketId, newStatus) {
    try {
      const response = await fetch(
        `${API_URL}/tickets/${ticketId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed");
      }

      await fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setSelectedTicket(null);

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ticket submission failed");
      }

      setSuccess("Ticket submitted and analyzed successfully!");
      setSelectedTicket(data.ticket);

      setForm({
        customer_name: "",
        email: "",
        subject: "",
        message: "",
      });

      await fetchTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const highPriorityTickets = tickets.filter(
    (ticket) =>
      ticket.priority === "High" ||
      ticket.priority === "Critical"
  ).length;

  const negativeTickets = tickets.filter(
    (ticket) => ticket.sentiment === "Negative"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-900 text-white px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">
            AI Support Automation
          </h1>
          <p className="text-slate-300 mt-1">
            Intelligent customer support ticket management
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Dashboard statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { title: "Total Tickets", value: tickets.length },
            { title: "Open Tickets", value: openTickets },
            { title: "High Priority", value: highPriorityTickets },
            { title: "Negative Sentiment", value: negativeTickets },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <p className="text-sm text-slate-500">
                {item.title}
              </p>
              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>
            </div>
          ))}
        </section>

        {/* Ticket submission form */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-bold mb-5">
            Submit a Support Ticket
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                placeholder="Customer Name"
                required
                className="border rounded-lg p-3 w-full"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Ticket Subject"
              required
              className="border rounded-lg p-3 w-full"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe the customer's issue..."
              required
              rows={4}
              className="border rounded-lg p-3 w-full"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {loading ? "Analyzing with AI..." : "Submit & Analyze Ticket"}
            </button>
          </form>

          {error && (
            <p className="text-red-600 mt-4">{error}</p>
          )}

          {success && (
            <p className="text-green-600 mt-4">{success}</p>
          )}
        </section>

        {/* Latest AI analysis */}
        {selectedTicket && (
          <section className="bg-white rounded-xl p-6 shadow-sm border border-blue-200 mb-8">
            <h2 className="text-xl font-bold mb-5">
              AI Analysis Result
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Category</p>
                <p className="font-semibold mt-1">
                  {selectedTicket.category}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Priority</p>
                <p className="font-semibold mt-1">
                  {selectedTicket.priority}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500">Sentiment</p>
                <p className="font-semibold mt-1">
                  {selectedTicket.sentiment}
                </p>
              </div>
            </div>

            <h3 className="font-semibold mb-2">
              Suggested Customer Reply
            </h3>

            <div className="bg-slate-50 p-4 rounded-lg border">
              {selectedTicket.suggested_reply}
            </div>
          </section>
        )}

        {/* Ticket list */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">
              Support Tickets
            </h2>

            <button
              onClick={fetchTickets}
              className="text-blue-600 font-medium hover:underline"
            >
              Refresh
            </button>
          </div>

          {tickets.length === 0 ? (
            <p className="text-slate-500">
              No tickets found. Submit your first ticket above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Sentiment</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="border-b hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="p-3">{ticket.customer_name}</td>
                      <td className="p-3">{ticket.subject}</td>
                      <td className="p-3">{ticket.category}</td>
                      <td className="p-3 font-semibold">
                        {ticket.priority}
                      </td>
                      <td className="p-3">{ticket.sentiment}</td>
                      <td
                        className="p-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket.id, e.target.value)
                          }
                          className="border rounded-md p-2 bg-white text-sm"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
