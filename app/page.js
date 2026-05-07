"use client";
import { useState } from "react";
import CartDrawer from "./components/CartDrawer";
import ProductModal from "./components/ProductModal";

const PRODUCTS = [
  {
    id: 1,
    name: "The North Korea Tee (White)",
    price: 35,
    img: "/images/white-tee.png",
    desc: "Oversized fit. 230 GSM.",
    stock: { S: 4, M: 5, L: 4, XL: 2 },
  },
  {
    id: 2,
    name: "The North Korea Tee (Black)",
    price: 35,
    img: "/images/black-tee.png",
    desc: "Oversized fit. 230 GSM.",
    stock: { S: 4, M: 4, L: 3, XL: 2 },
  },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [modal, setModal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(product, size) {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id && i.size === size);
      if (ex) {
        return prev.map((i) =>
          i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, size, qty: 1 }];
    });
    setModal(null);
    setDrawerOpen(true);
  }

  function removeFromCart(id, size) {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }

  return (
    <main style={{ background: "#fff", minHeight: "100vh" }}>
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: 52,
        borderBottom: "1px solid #000"
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 400,
          color: "#000",
          fontFamily: "'AlteHaas', sans-serif",
          letterSpacing: "0.04em"
        }}>
          MOURNING GLORY
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            fontSize: 12,
            fontWeight: 200,
            letterSpacing: "0.1em",
            color: "#000",
            background: "none",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'AlteHaas', sans-serif"
          }}
        >
          BAG
          <span style={{
            fontSize: 10,
            background: "#000",
            color: "#fff",
            borderRadius: "50%",
            width: 18,
            height: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontFamily: "'AlteHaas', sans-serif"
          }}>
            {cartCount}
          </span>
        </button>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: "#e0e0e0" }}>
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            onClick={() => setModal(p)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ background: "#fff", cursor: "pointer", overflow: "hidden" }}
          >
            <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "#F5F0E8" }}>
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                  transform: hovered === p.id ? "scale(1.04)" : "scale(1)",
                }}
              />
            </div>
            <div style={{
              padding: "12px 14px 14px",
              borderTop: "1.5px solid #000",
              fontFamily: "'AlteHaas', sans-serif"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#000", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{p.name}</span>
                <span style={{ fontSize: 12, color: "#000", fontWeight: 700 }}>${p.price}</span>
              </div>
              <div style={{ fontSize: 11, color: "#000", letterSpacing: "0.03em" }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <ProductModal
          product={modal}
          onClose={() => setModal(null)}
          onAdd={addToCart}
        />
      )}

      <CartDrawer
        cart={cart}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRemove={removeFromCart}
      />
    </main>
  );
}