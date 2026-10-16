import { useRef } from 'react';

export function useMessageEditor(value, setValue) {
  const inputRef = useRef(null);
  function insertEmoji(emoji) {
    const input = inputRef.current;
    if (!input || input.disabled) return;
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? start;
    const next = value.slice(0, start) + emoji + value.slice(end);
    if (next.length > input.maxLength) return;
    setValue(next);
    requestAnimationFrame(() => {
      if (!input.isConnected) return;
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }
  return { inputRef, insertEmoji };
}
