import { useState, useRef, useEffect, type CSSProperties } from "react";
import { ArrowLeft, Send as SendIcon, Phone, ChevronDown, Check, ShieldAlert, Inbox as InboxIcon, SquarePen, X, MoreVertical, Trash2, Smile } from "lucide-react";
import { C, gradients, font, radius } from "../core/theme";
import { useApp } from "../store/AppStore";

/** A small palette of common emojis for the in-chat picker. */
const EMOJIS = "😀 😂 😅 😊 😍 😘 😎 🤔 😴 😭 😡 👍 👎 🙏 👏 🙌 💪 🔥 🎉 ✨ ❤️ 💜 💔 ✅ ❌ ⭐ 📞 📱 💬 📷 🎁 💰 ⏰ 📍 🚀 👀 🤝 🙈 💯 😳".split(" ");

/**
 * Inbox — number-wise. Conversations are scoped to the selected owned number
 * (the "inbox"). A switcher lets the user jump between their numbers' inboxes.
 */
export function InboxScreen({ composeTo, onComposeHandled }: { composeTo?: string | null; onComposeHandled?: () => void } = {}) {
  const { state, selectNumber, sendMessage, markRead, startConversation, placeCall, deleteMessage, deleteConversation } = useApp();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [toInput, setToInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [headerMenu, setHeaderMenu] = useState(false);
  const [msgMenuId, setMsgMenuId] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeNumber = state.numbers.find((n) => n.id === state.activeNumberId) ?? state.numbers[0];
  const inboxConvos = state.conversations.filter((c) => c.numberId === activeNumber?.id);
  const activeConvo = state.conversations.find((c) => c.id === activeConvoId);

  // unread counts per number for the switcher
  const unreadFor = (numId: string) =>
    state.conversations.filter((c) => c.numberId === numId).reduce((s, c) => s + c.unread, 0);

  useEffect(() => {
    if (activeConvo) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo?.messages.length, activeConvo]);

  // Open the compose panel pre-filled to a number (e.g. "message" from a call log).
  useEffect(() => {
    if (!composeTo) return;
    setActiveConvoId(null);
    setToInput(composeTo);
    setBodyInput("");
    setComposing(true);
    onComposeHandled?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composeTo]);

  const openConvo = (id: string) => { setActiveConvoId(id); markRead(id); };

  const send = () => {
    if (!draft.trim() || !activeConvoId) return;
    if (sendMessage(activeConvoId, draft.trim())) setDraft("");
  };

  const openCompose = () => { setToInput(""); setBodyInput(""); setComposing(true); };
  const submitCompose = () => {
    if (!toInput.trim() || !bodyInput.trim()) return;
    const r = startConversation(toInput.trim(), bodyInput.trim());
    if (r.ok && r.convoId) {
      setComposing(false);
      setToInput(""); setBodyInput("");
      openConvo(r.convoId); // jump straight into the new thread
    }
    // On failure startConversation already surfaces a toast; keep the panel open.
  };

  /* ---------- Chat view ---------- */
  if (activeConvo) {
    const num = state.numbers.find((n) => n.id === activeConvo.numberId);
    const locked = num?.verification !== "verified";
    return (
      <div style={{ background: C.bg, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 16px 14px", background: C.card, borderBottom: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0, position: "relative" }}>
          <button onClick={() => setActiveConvoId(null)} style={iconBtn}>
            <ArrowLeft size={17} color={C.text} />
          </button>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{activeConvo.contactFlag}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: C.text, fontSize: 13, fontWeight: 700, fontFamily: font.mono }}>{activeConvo.contact}</p>
            <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>via {num?.settings.label || num?.number}</p>
          </div>
          <button onClick={() => placeCall(activeConvo.contact)} title="Call" style={{ ...iconBtn, background: "rgba(34,197,94,0.14)" }}><Phone size={16} color={C.green} /></button>
          <button onClick={() => setHeaderMenu((v) => !v)} title="More" style={iconBtn}><MoreVertical size={17} color={C.text} /></button>
          {headerMenu && (
            <>
              <div onClick={() => setHeaderMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
              <div style={{ position: "absolute", top: 60, right: 14, zIndex: 50, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.5)", overflow: "hidden", minWidth: 190 }}>
                <button onClick={() => { setHeaderMenu(false); placeCall(activeConvo.contact); }} style={menuItem}>
                  <Phone size={15} color={C.text} /> Call {activeConvo.contact}
                </button>
                <button onClick={() => { setHeaderMenu(false); deleteConversation(activeConvo.id); setActiveConvoId(null); }} style={{ ...menuItem, color: C.red, borderTop: `1px solid ${C.lineSoft}` }}>
                  <Trash2 size={15} color={C.red} /> Delete conversation
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
          {activeConvo.messages.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.sent ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "76%", position: "relative" }}>
                <div onClick={() => setMsgMenuId(msgMenuId === m.id ? null : m.id)} style={{
                  padding: "10px 14px", borderRadius: m.sent ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: m.sent ? gradients.brand : C.card, border: m.sent ? "none" : `1px solid ${C.line}`, cursor: "pointer",
                }}>
                  <p style={{ color: C.text, fontSize: 14, lineHeight: 1.45, wordBreak: "break-word" }}>{m.text}</p>
                </div>
                <p style={{ color: C.muted, fontSize: 10, marginTop: 5, textAlign: m.sent ? "right" : "left" }}>
                  {m.time}{m.sent && m.status ? ` · ${DLR_LABEL[m.status]}` : ""}
                </p>
                {msgMenuId === m.id && (
                  <button onClick={() => { deleteMessage(activeConvo.id, m.id); setMsgMenuId(null); }} title="Delete message" style={{
                    position: "absolute", top: -9, [m.sent ? "left" : "right"]: -9, width: 26, height: 26, borderRadius: "50%",
                    background: C.red, border: `2px solid ${C.bg}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}>
                    <Trash2 size={13} color="#fff" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {locked && (
          <div style={{ margin: "0 16px 8px", padding: "10px 14px", borderRadius: radius.md, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldAlert size={15} color={C.amber} />
            <span style={{ color: C.amber, fontSize: 11.5, fontWeight: 600 }}>Register this number to send messages</span>
          </div>
        )}

        {/* Emoji picker */}
        {showEmoji && (
          <div style={{ margin: "0 12px 6px", padding: "10px 12px", background: C.card, border: `1px solid ${C.line}`, borderRadius: radius.md, display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 168, overflowY: "auto", flexShrink: 0 }}>
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => setDraft((d) => d + e)} style={{ background: "none", border: "none", fontSize: 23, cursor: "pointer", padding: 5, lineHeight: 1, borderRadius: 8 }}>{e}</button>
            ))}
          </div>
        )}

        <div style={{ padding: "12px 12px 20px", background: C.card, borderTop: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={() => setShowEmoji((v) => !v)} title="Emoji" style={{ ...iconBtn, background: showEmoji ? "rgba(124,92,255,0.2)" : C.input }}>
            <Smile size={19} color={showEmoji ? C.blue : C.muted} />
          </button>
          <input
            value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={locked ? "Number not registered…" : "Type a message…"}
            style={{ flex: 1, minWidth: 0, padding: "12px 16px", background: C.input, border: `1px solid ${C.line}`, borderRadius: radius.xl, color: C.text, fontSize: 14, outline: "none", fontFamily: font.sans }}
          />
          <button onClick={send} style={{
            width: 46, height: 46, borderRadius: "50%", flexShrink: 0, border: "none",
            background: locked ? "rgba(255,255,255,0.08)" : gradients.brand,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: locked ? "none" : "0 4px 16px rgba(124,92,255,0.4)",
          }}>
            <SendIcon size={17} color={locked ? C.faint : "#fff"} />
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Inbox list view ---------- */
  return (
    <div style={{ background: C.bg, minHeight: "100%", paddingBottom: 24, position: "relative" }}>
      {/* Inbox header / switcher trigger */}
      <div style={{ padding: "16px 20px 8px" }}>
        <h1 style={{ color: C.text, fontSize: 23, fontWeight: 800 }}>Inbox</h1>
        <button onClick={() => setShowSwitcher(true)} style={{
          marginTop: 10, width: "100%", background: C.card, border: `1px solid ${C.line}`,
          borderRadius: radius.md, padding: "12px 14px", display: "flex", alignItems: "center",
          gap: 12, cursor: "pointer", fontFamily: font.sans,
        }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{activeNumber?.settings.icon}</div>
          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <p style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{activeNumber?.settings.label || "Inbox"}</p>
            <p style={{ color: C.muted, fontSize: 12, fontFamily: font.mono, marginTop: 2 }}>{activeNumber?.number}</p>
          </div>
          <ChevronDown size={18} color={C.muted} />
        </button>
      </div>

      {/* Conversations for the active inbox */}
      <div style={{ padding: "8px 20px 0" }}>
        {inboxConvos.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 46, marginBottom: 12 }}>📭</div>
            <p style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>No conversations</p>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>This number has no messages yet</p>
          </div>
        ) : (
          <div style={{ background: C.card, borderRadius: radius.lg, border: `1px solid ${C.lineSoft}`, overflow: "hidden" }}>
            {inboxConvos.map((c, i) => (
              <div key={c.id} onClick={() => openConvo(c.id)} style={{
                padding: "14px 16px", borderBottom: i < inboxConvos.length - 1 ? `1px solid ${C.lineSoft}` : "none",
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, position: "relative" }}>
                  {c.contactFlag}
                  {c.unread > 0 && <div style={{ position: "absolute", top: -3, right: -3, width: 14, height: 14, borderRadius: "50%", background: C.green, border: "2px solid #10141f" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: C.text, fontSize: 13, fontWeight: 700, fontFamily: font.mono }}>{c.contact}</p>
                  <p style={{ color: C.muted, fontSize: 12, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.preview}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{ color: C.muted, fontSize: 11 }}>{c.time}</span>
                  {c.unread > 0 && <span style={{ background: C.blue, color: "#fff", fontSize: 9, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{c.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New-message FAB */}
      <button onClick={openCompose} title="New message" style={{
        position: "fixed", bottom: 98, right: "calc(50% - 195px + 16px)", width: 58, height: 58, borderRadius: "50%",
        background: gradients.brand, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 6px 24px rgba(124,92,255,0.45)", zIndex: 20,
      }}>
        <SquarePen size={23} color="#fff" />
      </button>

      {/* Compose a new message */}
      {composing && (
        <div style={{ position: "absolute", inset: 0, zIndex: 90, background: C.bg, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 16px 14px", background: C.card, borderBottom: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button onClick={() => setComposing(false)} style={iconBtn}><X size={17} color={C.text} /></button>
            <p style={{ color: C.text, fontSize: 16, fontWeight: 800, flex: 1 }}>New message</p>
          </div>

          <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 14, flex: 1, overflowY: "auto" }}>
            {/* From — a tappable number selector (mirrors the dialer's "CALLING FROM"). */}
            <div>
              <label style={{ color: C.faint, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>From</label>
              <button onClick={() => setShowFromPicker(true)} style={{
                width: "100%", marginTop: 6, padding: "11px 14px", background: C.input, border: `1px solid ${C.line}`,
                borderRadius: radius.md, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: font.sans,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: C.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{activeNumber?.settings.icon || "📱"}</div>
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <p style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{activeNumber?.settings.label || "Select a number"}</p>
                  <p style={{ color: C.muted, fontSize: 11.5, fontFamily: font.mono }}>{activeNumber?.number || "—"}</p>
                </div>
                {activeNumber && activeNumber.verification !== "verified" && (
                  <span style={{ color: C.amber, fontSize: 10.5, fontWeight: 700 }}>not registered</span>
                )}
                <ChevronDown size={16} color={C.muted} />
              </button>
            </div>
            <div>
              <label style={{ color: C.faint, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>To</label>
              <input
                value={toInput} onChange={(e) => setToInput(e.target.value)} inputMode="tel"
                placeholder="+1 555 123 4567"
                style={{ width: "100%", marginTop: 6, padding: "12px 14px", background: C.input, border: `1px solid ${C.line}`, borderRadius: radius.md, color: C.text, fontSize: 14, outline: "none", fontFamily: font.mono, boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label style={{ color: C.faint, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>Message</label>
              <textarea
                value={bodyInput} onChange={(e) => setBodyInput(e.target.value)} rows={5}
                placeholder="Type your message…"
                style={{ width: "100%", marginTop: 6, padding: "12px 14px", background: C.input, border: `1px solid ${C.line}`, borderRadius: radius.md, color: C.text, fontSize: 14, outline: "none", fontFamily: font.sans, resize: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ padding: "12px 16px 22px", background: C.card, borderTop: `1px solid ${C.lineSoft}`, flexShrink: 0 }}>
            <button onClick={submitCompose} disabled={!toInput.trim() || !bodyInput.trim()} style={{
              width: "100%", padding: "14px", borderRadius: radius.xl, border: "none",
              background: (!toInput.trim() || !bodyInput.trim()) ? "rgba(255,255,255,0.08)" : gradients.brand,
              color: (!toInput.trim() || !bodyInput.trim()) ? C.faint : "#fff", fontSize: 15, fontWeight: 800,
              cursor: (!toInput.trim() || !bodyInput.trim()) ? "default" : "pointer", fontFamily: font.sans,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <SendIcon size={16} /> Send message
            </button>
          </div>

          {/* "Send from" number picker (only SMS-capable numbers can text). */}
          {showFromPicker && (
            <div onClick={(e) => e.target === e.currentTarget && setShowFromPicker(false)} style={{ position: "absolute", inset: 0, zIndex: 95, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", background: C.card, borderRadius: "26px 26px 0 0", border: `1px solid ${C.line}`, maxHeight: "72%", overflowY: "auto", padding: "8px 0 24px" }}>
                <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 6px" }}>
                  <div style={{ width: 38, height: 4, borderRadius: 2, background: C.line }} />
                </div>
                <p style={{ color: C.text, fontSize: 16, fontWeight: 800, padding: "8px 20px 12px" }}>Send from</p>
                {state.numbers.filter((n) => n.sms).map((n) => {
                  const sel = n.id === activeNumber?.id;
                  return (
                    <button key={n.id} onClick={() => { selectNumber(n.id); setShowFromPicker(false); }} style={{
                      width: "100%", padding: "13px 20px", background: sel ? "rgba(124,92,255,0.12)" : "transparent",
                      border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: font.sans,
                    }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{n.settings.icon}</div>
                      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <p style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{n.settings.label}</p>
                        <p style={{ color: C.muted, fontSize: 12, fontFamily: font.mono, marginTop: 2 }}>{n.number}</p>
                      </div>
                      {sel && <Check size={18} color={C.blue} />}
                    </button>
                  );
                })}
                <p style={{ color: C.faint, fontSize: 11, padding: "12px 20px 0", lineHeight: 1.5 }}>Only numbers with SMS capability can send texts.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inboxes switcher drawer */}
      {showSwitcher && (
        <div onClick={(e) => e.target === e.currentTarget && setShowSwitcher(false)} style={{ position: "absolute", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: "100%", background: C.card, borderRadius: "26px 26px 0 0", border: `1px solid ${C.line}`, maxHeight: "82%", overflowY: "auto", padding: "8px 0 24px" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 6px" }}>
              <div style={{ width: 38, height: 4, borderRadius: 2, background: C.line }} />
            </div>
            <div style={{ padding: "8px 20px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <InboxIcon size={17} color={C.muted} />
              <p style={{ color: C.text, fontSize: 16, fontWeight: 800 }}>Inboxes</p>
            </div>
            {state.numbers.map((n) => {
              const u = unreadFor(n.id);
              const sel = n.id === activeNumber?.id;
              return (
                <button key={n.id} onClick={() => { selectNumber(n.id); setShowSwitcher(false); }} style={{
                  width: "100%", padding: "13px 20px", background: sel ? "rgba(124,92,255,0.12)" : "transparent",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: font.sans,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: C.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{n.settings.icon}</div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <p style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{n.settings.label}</p>
                    <p style={{ color: C.muted, fontSize: 12, fontFamily: font.mono, marginTop: 2 }}>{n.number}</p>
                  </div>
                  {u > 0 && <span style={{ background: C.blue, color: "#fff", fontSize: 10, fontWeight: 800, minWidth: 20, height: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{u}</span>}
                  {sel && <Check size={17} color={C.blue} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtn: CSSProperties = {
  width: 36, height: 36, borderRadius: 11, background: C.input, border: "none",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
};

const menuItem: CSSProperties = {
  width: "100%", padding: "12px 14px", background: "none", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", gap: 10, color: C.text, fontSize: 13.5, fontWeight: 600,
  fontFamily: font.sans, textAlign: "left",
};

/** Telnyx delivery-status label shown under sent bubbles. */
const DLR_LABEL: Record<string, string> = {
  sending: "Sending…", sent: "Sent ✓", delivered: "Delivered ✓✓", failed: "Failed ✕",
};
