import { useState } from "react";
import "./CustomInput.css"

export function CustomInput({type, name, placeholder, value="", handler, isDisabled=false}) {
    const [focused, setFocused] = useState(false);
  
    return (
      <input
        disabled={isDisabled}
        className={`custom-input-design ${focused ? 'focused' : ''}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handler(e)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused (false)}
      />
    );
  }