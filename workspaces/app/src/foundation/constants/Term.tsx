import { useState } from 'react';
import { useAsync } from 'react-use';

const Term = () => {
  const [text, setText] = useState('');
  useAsync(async () => {
    const res = await fetch('/assets/term.txt', {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    const _text = await res.text();
    setText(_text);
  });
  return <>{text}</>;
};
export default Term;
