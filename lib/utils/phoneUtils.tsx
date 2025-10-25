import { TextInput } from "@mantine/core";
import { useState, useEffect } from "react";

// Função para formatar telefone brasileiro
export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 2) {
    return numbers ? `(${numbers}` : "";
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7
    )}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7,
      11
    )}`;
  }
};

// Função para extrair apenas números do telefone
export const extractPhoneNumbers = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 11);
};

// Função para validar se telefone tem formato válido
export const isValidPhoneNumber = (value: string): boolean => {
  const numbers = extractPhoneNumbers(value);
  return numbers.length >= 10 && numbers.length <= 11;
};

// Componente de input com máscara de telefone reutilizável
interface PhoneInputProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  radius?: string;
  value: string;
  onChange: (value: string) => void;
  error?: React.ReactNode;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  [key: string]: any; // Para props adicionais do TextInput
}

export const PhoneInput = ({
  label = "Telefone",
  placeholder = "(11) 99999-9999",
  required = false,
  radius = "md",
  value,
  onChange,
  error,
  disabled = false,
  size = "md",
  ...otherProps
}: PhoneInputProps) => {
  const [displayValue, setDisplayValue] = useState("");

  // Sincronizar valor formatado quando o valor externo mudar
  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numbersOnly = extractPhoneNumbers(inputValue);

    // Atualizar valor formatado para display
    setDisplayValue(formatPhoneNumber(numbersOnly));

    // Salvar apenas números no form
    onChange(numbersOnly);
  };

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      required={required}
      radius={radius}
      value={displayValue}
      onChange={handleChange}
      error={error}
      disabled={disabled}
      size={size}
      {...otherProps}
    />
  );
};

// Hook para usar telefone formatado em exibições (apenas leitura)
export const useFormattedPhone = (phoneNumber: string) => {
  return phoneNumber ? formatPhoneNumber(phoneNumber) : "";
};
