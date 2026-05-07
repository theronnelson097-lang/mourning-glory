"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ cart, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ email: "", first: "", last: "", address: "", city: "", zip: "", country: "US" });

  async function handleSubmit() {
    if (!stripe || !elements) return;
    const f = form;
    if (!f.email || !f.first || !f.last || !f.address || !f.city || !f.zip) {
      setErr("Please fill in all fields.");
      return;
    }
    setErr("");
    setPaying(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        receipt_email: f.email,
        shipping: {
          name: `${f.first} ${f.last}`,
          address: {
            line1: f.address,
            city: f.city,
            postal_code: f.zip,
            country: f.country,
          },
        },
      },
    });

    if (error) {
      setErr(error.message);
      setPaying(false);
    }
  }

  const inp = {
    width: "100%",
    border: "none",
    borderBottom: "1px solid #ccc",
    fontSize: 14,
    fontFamily: "'AlteHaas', sans-serif",
    padding: "10px 0",
    outline: "none",
    background: "transparent",
    marginBottom: 16,
    color: "#000",
  };

  const label = {
    fontSize: 10,
    fontFamily: "'AlteHaas', sans-serif",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#888",
    display: "block",
    marginBottom: 8,
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px 80px", fontFamily: "'AlteHaas', sans-serif" }}>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888", marginBottom: 16 }}>Order Summary</div>
        {cart.map((i) => (
          <div key={i.id + i.size} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderBottom: "1px solid #eee", color: "#000" }}>
            <span>{i.name} — {i.size} × {i.qty}</span>
            <span>${i.price * i.qty}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, marginTop: 16, color: "#000" }}>
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <span style={label}>Contact</span>
        <input style={inp} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>

      <div style={{ marginBottom: 32 }}>
        <span style={label}>Shipping</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input style={inp} placeholder="First name" value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} />
          <input style={inp} placeholder="Last name" value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} />
        </div>
        <input style={inp} placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input style={inp} placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input style={inp} placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <span style={label}>Payment</span>
        <PaymentElement />
      </div>

      {err && <p style={{ fontSize: 12, color: "red", marginBottom: 16 }}>{err}</p>}

      <button
        onClick={handleSubmit}
        disabled={paying || !stripe}
        style={{ width: "100%", background: "#000", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: 16, cursor: paying ? "not-allowed" : "pointer", fontFamily: "'AlteHaas', sans-serif", opacity: paying ? 0.5 : 1 }}
      >
        {paying ? "Processing..." : `Pay $${total}`}
      </button>
      <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Secured by Stripe</p>
    </div>
  );
}

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    const saved = localStorage.getItem("mg_cart");
    if (!saved) { router.push("/"); return; }
    const parsed = JSON.parse(saved);
    setCart(parsed);
    const amount = parsed.reduce((s, i) => s + i.price * i.qty, 0);
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((r) => r.json())
      .then((d) => setClientSecret(d.clientSecret));
  }, []);

  if (!clientSecret) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'AlteHaas', sans-serif", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>
      Loading...
    </div>
  );

  return (
    <div style={{ fontFamily: "'AlteHaas', sans-serif", minHeight: "100vh", background: "#fff" }}>
      <nav style={{ borderBottom: "1px solid #000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 52 }}>
        <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'AlteHaas', sans-serif", color: "#000" }}>Mourning Glory</span>
        <button onClick={() => router.push("/")} style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", fontFamily: "'AlteHaas', sans-serif", color: "#000" }}>← Back</button>
      </nav>
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
        <CheckoutForm cart={cart} total={total} />
      </Elements>
    </div>
  );
}