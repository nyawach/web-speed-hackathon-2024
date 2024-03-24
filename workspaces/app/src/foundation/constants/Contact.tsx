import { useState } from "react";
import { useAsync } from "react-use";

const Contact = () => {
  const [text, setText] = useState('')
  useAsync(async () => {
    const res = await fetch('/assets/contact.txt', {
      headers: {
        'Content-Type': 'text/plain',
      }
    })
    const _text = await res.text()
    setText(_text)
  })
  return <>{text}</>
};
export default Contact;
