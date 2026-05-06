"use client";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "'AlteHaas', sans-serif", textAlign: "center", padding: 24 }}>
      <div style={{ fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888", marginBottom: 16 }}>Order Confirmed</div>
      <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, marginBottom: 24 }}>Thank you.</div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 40 }}>You'll receive a confirmation email shortly.</div>
      <button onClick={() => router.push("/")} style={{ background: "#000", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", cursor: "pointer", fontFamily: "'AlteHaas', sans-serif" }}>
        Back to Shop
      </button>
    </div>
  );
}