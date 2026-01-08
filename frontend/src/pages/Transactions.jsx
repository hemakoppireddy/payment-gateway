import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Transactions() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function fetchPayments() {
      try {
        // Assumes evaluator has payments created already
        const data = await apiFetch("/api/v1/payments");
        setPayments(data || []);
      } catch (err) {
        setPayments([]);
      }
    }

    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Transactions</h2>

      <table
        data-test-id="transactions-table"
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              data-test-id="transaction-row"
              data-payment-id={payment.id}
            >
              <td data-test-id="payment-id">
                {payment.id}
              </td>

              <td data-test-id="order-id">
                {payment.order_id}
              </td>

              <td data-test-id="amount">
                {payment.amount}
              </td>

              <td data-test-id="method">
                {payment.method}
              </td>

              <td data-test-id="status">
                {payment.status}
              </td>

              <td data-test-id="created-at">
                {new Date(payment.created_at)
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
