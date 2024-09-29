// TODO: Send input on un-mount if different
import { useState, useEffect, CSSProperties, ChangeEvent } from "react";

interface DebounceInputProps {
  id?: string | null;
  className?: string | null;
  value: any;
  type?: string | null;
  autoComplete?: "on" | "off" | null;
  placeholder?: string | null;
  onChange: (value: any) => void;
  onBlur?: () => void;
  debounceTimeout: number;
  style?: CSSProperties;
}

const DebounceInput = ({ id, className, value, type, autoComplete, placeholder, onChange, onBlur, debounceTimeout, style }: DebounceInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [changeEvent, setChangeEvent] = useState<ChangeEvent<HTMLInputElement> | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setChangeEvent(e);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (changeEvent) {
        onChange(changeEvent);
        setChangeEvent(null);
      } else {
        setInputValue(value);
      }
    }, debounceTimeout);

    return () => clearTimeout(timeout);
  }, [value, changeEvent, debounceTimeout]);

  return (
    <input
      id={id ?? Math.random().toString()}
      className={className ?? ""}
      value={inputValue}
      type={type ?? "text"}
      autoComplete={autoComplete ?? "off"}
      placeholder={placeholder ?? ""}
      onChange={handleInputChange}
      onBlur={onBlur}
      style={style}
    />
  )
}

export default DebounceInput;
