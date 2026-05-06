"use client";
import { useState } from "react";

export default function ProductModal({ product, onClose, onAdd }) {
  const [selSize, setSelSize] = useState(null);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24
      }}
    >
      <div style={{
        background: "#fff",
        width: "100%",
        maxWidth: 560,
        padding: "40px 36px 48px",
        position: "relative",
        fontFamily: "'AlteHaas', sans-serif"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "none",
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'AlteHaas', sans-serif",
            color: "#000"
          }}
        >
          ✕
        </button>

        <img
          src={product.img}
          alt={product.name}
          style={{
            width: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
            marginBottom: 24,
            background: "#F5F0E8"
          }}
        />

        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4, paddingRight: 30, color: "#000" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 12, color: "#444", marginBottom: 6, letterSpacing: "0.03em" }}>
          {product.desc}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 24, color: "#000" }}>
          ${product.price}
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {Object.entries(product.stock).map(([sz, qty]) => (
            <button
              key={sz}
              onClick={() => qty > 0 && setSelSize(sz)}
              style={{
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'AlteHaas', sans-serif",
                letterSpacing: "0.06em",
                border: selSize === sz ? "1.5px solid #000" : "1.5px solid #aaa",
                background: qty === 0 ? "#f5f5f5" : selSize === sz ? "#000" : "none",
                color: qty === 0 ? "#bbb" : selSize === sz ? "#fff" : "#000",
                padding: "10px 16px",
                cursor: qty === 0 ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                textDecoration: qty === 0 ? "line-through" : "none",
              }}
            >
              {sz}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (!selSize) { alert("Pick a size"); return; }
            onAdd(product, selSize);
          }}
          style={{
            width: "100%",
            background: "#000",
            color: "#fff",
            border: "none",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: 16,
            cursor: "pointer",
            fontFamily: "'AlteHaas', sans-serif"
          }}
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}