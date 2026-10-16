import { useId, useRef, useState } from 'react';
import './style.css';

const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😉', '😍', '🥰', '😘', '😎', '🤔', '😴', '😢', '😭', '😮', '🙌', '👏', '👍', '👎', '👋', '🙏', '❤️', '💙', '💜', '✨', '🎉', '🔥', '✅', '📚', '📝', '📅', '💡', '💬'];

export default function EmojiPicker({ onSelect, disabled }) {
  const id = useId();
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  function position(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const panel = panelRef.current;
    panel.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 288))}px`;
    panel.style.top = `${Math.max(8, rect.top - 232)}px`;
  }
  return <>
    <button type="button" className="message-tool" popoverTarget={id} aria-label="Agregar emoji" title="Emojis" aria-expanded={open} disabled={disabled} onClick={position}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 14c1 4 7 4 8 0" /><circle cx="8.5" cy="9" r=".8" fill="currentColor" /><circle cx="15.5" cy="9" r=".8" fill="currentColor" /></svg>
    </button>
    <div id={id} ref={panelRef} popover="auto" className="emoji-picker" aria-label="Selector de emojis" onToggle={event => setOpen(event.newState === 'open')}>
      <p>Emojis</p>
      <div className="emoji-picker__grid">{emojis.map(emoji => <button key={emoji} type="button" aria-label={`Insertar ${emoji}`} disabled={disabled} onClick={() => { panelRef.current.hidePopover(); onSelect(emoji); }}>{emoji}</button>)}</div>
    </div>
  </>;
}
