import { atom } from 'jotai';

const StateAtom = atom<JSX.Element | null>(null);

export const DialogContentAtom = atom(
  (get) => {
    return get(StateAtom);
  },
  (_get, set, content: JSX.Element | null) => {
    const isOpen = content != null;
    const body = window.document.body
    body.style.overflow = isOpen ? 'hidden' : 'scroll';
    set(StateAtom, content);
  },
);
