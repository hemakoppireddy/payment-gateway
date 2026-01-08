import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Checkout() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");

  if (!orderId) {
    return <div>Invalid checkout URL. Missing order_id.</div>;
  }

  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // 🔹 Fetch order (public endpoint)
  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await apiFetch(
          `/api/v1/orders/${orderId}/public`
        );
        setOrder(data);
      } catch {
        setError("Order not found");
      }
    }

    fetchOrder();
  }, [orderId]);

  // 🔹 Poll payment status (AUTH REQUIRED)
  function pollPayment(id) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/payments/${id}`,
          {
            headers: {
              "X-Api-Key": "key_test_abc123",
              "X-Api-Secret": "secret_test_xyz789"
            }
          }
        );

        const data = await res.json();

        if (data.status !== "processing") {
          clearInterval(interval);
          setStatus(data.status);
        }
      } catch {
        clearInterval(interval);
        setStatus("failed");
        setError("Failed to fetch payment status");
      }
    }, 2000);
  }

  // 🔹 Handle UPI payment
  async function handleUPIPay(e) {
    e.preventDefault();
    setStatus("processing");
    setError("");

    try {
      const res = await apiFetch(
        "/api/v1/payments/public",
        {
          method: "POST",
          body: JSON.stringify({
            order_id: orderId,
            method: "upi",
            vpa: e.target.vpa.value
          })
        }
      );

      setPaymentId(res.id);
      pollPayment(res.id);
    } catch (err) {
      setStatus("failed");
      setError(err.error?.description || "Payment failed");
    }
  }

  // 🔹 Handle Card payment
  async function handleCardPay(e) {
    e.preventDefault();
    setStatus("processing");
    setError("");

    try {
      const res = await apiFetch(
        "/api/v1/payments/public",
        {
          method: "POST",
          body: JSON.stringify({
            order_id: orderId,
            method: "card",
            card: {
              number: e.target.number.value,
              expiry_month: e.target.expiry.value.split("/")[0],
              expiry_year: e.target.expiry.value.split("/")[1],
              cvv: e.target.cvv.value,
              holder_name: e.target.name.value
            }
          })
        }
      );

      setPaymentId(res.id);
      pollPayment(res.id);
    } catch (err) {
      setStatus("failed");
      setError(err.error?.description || "Payment failed");
    }
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div data-test-id="checkout-container">
      {/* Order Summary */}
      <div data-test-id="order-summary">
        <h2>Complete Payment</h2>
        <div>
          <span>Amount: </span>
          <span data-test-id="order-amount">
            ₹{order.amount / 100}
          </span>
        </div>
        <div>
          <span>Order ID: </span>
          <span data-test-id="order-id">{order.id}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div data-test-id="payment-methods">
        <button
          data-test-id="method-upi"
          onClick={() => setMethod("upi")}
        >
          UPI
        </button>

        <button
          data-test-id="method-card"
          onClick={() => setMethod("card")}
          style={{ marginLeft: "10px" }}
        >
          Card
        </button>
      </div>

      {/* UPI Form */}
      {method === "upi" && (
        <form data-test-id="upi-form" onSubmit={handleUPIPay}>
          <input
            data-test-id="vpa-input"
            name="vpa"
            placeholder="username@bank"
            required
          />
          <button data-test-id="pay-button" type="submit">
            Pay ₹{order.amount / 100}
          </button>
        </form>
      )}

      {/* Card Form */}
      {method === "card" && (
        <form data-test-id="card-form" onSubmit={handleCardPay}>
          <input
            data-test-id="card-number-input"
            name="number"
            placeholder="Card Number"
            required
          />

          <input
            data-test-id="expiry-input"
            name="expiry"
            placeholder="MM/YY"
            required
          />

          <input
            data-test-id="cvv-input"
            name="cvv"
            placeholder="CVV"
            required
          />

          <input
            data-test-id="cardholder-name-input"
            name="name"
            placeholder="Name on Card"
            required
          />

          <button data-test-id="pay-button" type="submit">
            Pay ₹{order.amount / 100}
          </button>
        </form>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div data-test-id="processing-state">
          <span data-test-id="processing-message">
            Processing payment...
          </span>
        </div>
      )}

      {/* Success */}
      {status === "success" && (
        <div data-test-id="success-state">
          <h2>Payment Successful!</h2>
          <div>
            <span>Payment ID: </span>
            <span data-test-id="payment-id">{paymentId}</span>
          </div>
          <span data-test-id="success-message">
            Your payment has been processed successfully
          </span>
        </div>
      )}

      {/* Error */}
      {status === "failed" && (
        <div data-test-id="error-state">
          <h2>Payment Failed</h2>
          <span data-test-id="error-message">{error}</span>
          <button
            data-test-id="retry-button"
            onClick={() => {
              setStatus("idle");
              setError("");
              setPaymentId(null);
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
