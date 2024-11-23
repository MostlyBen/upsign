// TODO: Seems like it doesn't send on unmount
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
  min?: number;
}

const DebounceInput = ({
  id,
  className,
  value,
  type,
  autoComplete,
  placeholder,
  onChange,
  onBlur,
  debounceTimeout,
  style,
  min,
}: DebounceInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [changeEvent, setChangeEvent] = useState<ChangeEvent<HTMLInputElement> | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setChangeEvent(e);
  }

  useEffect(() => {
    // Send on componenet un-mount
    return () => {
      if (changeEvent) {
        onChange(changeEvent);
      }
    }
  }, []);

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
      min={typeof min !== "undefined" ? `${min}` : undefined}
    />
  )
}

export default DebounceInput;
