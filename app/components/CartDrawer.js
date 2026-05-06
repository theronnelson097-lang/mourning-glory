"use client";
import { useRouter } from "next/navigation";

export default function CartDrawer({ cart, open, onClose, onRemove }) {
  const router = useRouter();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  function goCheckout() {
    localStorage.setItem("mg_cart", JSON.stringify(cart));
    onClose();
    router.push("/checkout");
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: open ? 0 : "-100%",
      width: "100%",
      maxWidth: 380,
      height: "100vh",
      background: "#fff",
      zIndex: 300,
      display: "flex",
      flexDirection: "column",
      borderLeft: "2px solid #000",
      transition: "right 0.35s cubic-bezier(0.16,1,0.3,1)",
      fontFamily: "'AlteHaas', sans-serif"
    }}>
      <div style={{
        background: "#000",
        padding: "0 16px",
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff" }}>Bag</span>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#fff", fontFamily: "'AlteHaas', sans-serif" }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ccc" }}>
            Empty
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id + item.size} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #eee" }}>
              <img src={item.img} alt={item.name} style={{ width: 64, height: 64, objectFit: "cover", background: "#F5F0E8", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 3 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>{item.size} · Qty {item.qty}</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>${item.price * item.qty}</div>
              </div>
              <button onClick={() => onRemove(item.id, item.size)} style={{ background: "none", border: "none", fontSize: 13, cursor: "pointer", color: "#ccc", alignSelf: "flex-start", fontFamily: "'AlteHaas', sans-serif" }}>✕</button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div style={{ padding: 16, borderTop: "1.5px solid #000" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>${total}</span>
          </div>
          <button
            onClick={goCheckout}
            style={{ width: "100%", background: "#000", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: 16, cursor: "pointer", fontFamily: "'AlteHaas', sans-serif" }}
          >
            CHECKOUT
          </button>
        </div>
      )}
    </div>
  );
}