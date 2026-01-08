import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successRate: 0
  });

  useEffect(() => {
  async function fetchDashboardStats() {
    try {
      const payments = await fetch(
        "http://localhost:8000/api/v1/payments",
        {
          headers: {
            "X-Api-Key": "key_test_abc123",
            "X-Api-Secret": "secret_test_xyz789"
          }
        }
      ).then(res => res.json());

      const totalTransactions = payments.length;

      const successfulPayments = payments.filter(
        p => p.status === "success"
      );

      const totalAmount = successfulPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      const successRate =
        totalTransactions === 0
          ? 0
          : Math.round(
              (successfulPayments.length / totalTransactions) * 100
            );

      setStats({
        totalTransactions,
        totalAmount,
        successRate
      });
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  }

  fetchDashboardStats();
}, []);


  return (
    <div data-test-id="dashboard">
      <h1>Dashboard</h1>

      {/* API Credentials */}
      <div data-test-id="api-credentials">
        <div>
          <label>API Key</label>
          <span data-test-id="api-key">key_test_abc123</span>
        </div>

        <div>
          <label>API Secret</label>
          <span data-test-id="api-secret">secret_test_xyz789</span>
        </div>
      </div>

      {/* Stats */}
      <div data-test-id="stats-container">
        <div data-test-id="total-transactions">
          {stats.totalTransactions}
        </div>

        <div data-test-id="total-amount">
          ₹{stats.totalAmount / 100}
        </div>

        <div data-test-id="success-rate">
          {stats.successRate}%
        </div>
      </div>
    </div>
  );
}
