// src/app/dashboard/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { getTickets, createTicket } from "@/src/services/api";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    from: "",
    to: "",
    departureTime: "",
    price: "",
  });
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchTickets();
    }
  }, [user, router]);

  const fetchTickets = async () => {
    try {
      const response = await getTickets();
      setTickets(response.data);
    } catch (error) {
      setError("Failed to fetch tickets. Please try again.");
      console.error("Failed to fetch tickets:", error);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createTicket({
        ...newTicket,
        price: parseFloat(newTicket.price),
        departureTime: new Date(newTicket.departureTime).toISOString(),
      });
      setNewTicket({ from: "", to: "", departureTime: "", price: "" });
      fetchTickets();
    } catch (error) {
      setError("Failed to create ticket. Please try again.");
      console.error("Failed to create ticket:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">NRC Ticketing</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div
              className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-4">Create New Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label
                htmlFor="from"
                className="block text-sm font-medium text-gray-700"
              >
                From
              </label>
              <input
                type="text"
                id="from"
                value={newTicket.from}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, from: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="to"
                className="block text-sm font-medium text-gray-700"
              >
                To
              </label>
              <input
                type="text"
                id="to"
                value={newTicket.to}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, to: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="departureTime"
                className="block text-sm font-medium text-gray-700"
              >
                Departure Time
              </label>
              <input
                type="datetime-local"
                id="departureTime"
                value={newTicket.departureTime}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, departureTime: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={newTicket.price}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, price: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Ticket
            </button>
          </form>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Tickets</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {ticket.from} to {ticket.to}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          ${ticket.price}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Departure:{" "}
                          {new Date(ticket.departureTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
