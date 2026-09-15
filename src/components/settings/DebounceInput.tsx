"use client";
import React, { useState, useEffect } from "react";
import { Input } from "antd";
import type { InputProps } from "antd";

type DebouncedInputProps = InputProps & {
  delay?: number;
  onDebounce: (value: string) => void;
  value: string;
};

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue = "",
  onDebounce,
  delay = 500,
  ...rest
}) => {
  const [innerValue, setInnerValue] = useState<string>(initialValue);

  const handlePressEnter = () => {
    onDebounce(innerValue);
  };

  // Debounce the callback
  useEffect(() => {
    const handler = setTimeout(() => {
      if (innerValue !== initialValue) {
        onDebounce(innerValue);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [innerValue, delay, onDebounce, initialValue]);

  return (
    <Input
      {...rest}
      onPressEnter={handlePressEnter}
      value={innerValue}
      onChange={(e) => setInnerValue(e.target.value)}
    />
  );
};
