// components/FloatingLabelInput.tsx
import { useState } from 'react';

interface FloatingLabelInputProps {
    id: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    placeholder?: string;
    required?: boolean;
    showPasswordToggle?: boolean;
}

export default function FloatingLabelInput({
    id,
    name,
    type = 'text',
    value,
    onChange,
    label,
    placeholder = '',
    required = false,
    showPasswordToggle = false
}: FloatingLabelInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle
        ? (showPassword ? 'text' : 'password')
        : type;

    const isFloating = isFocused || value.length > 0;

    return (
        <div className="relative">
            <input
                type={inputType}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFloating ? placeholder : ''}
                className="w-full px-4 py-3 border border-border-light rounded-lg placeholder:text-primary-black focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent peer"
                required={required}
            />

            {/* Floating Label */}
            <label
                htmlFor={id}
                className={`absolute left-3 transition-all duration-200 pointer-events-none text-primary-gray ${
                    isFloating
                        ? '-top-2 text-xs bg-primary-white px-1'
                        : 'top-3 text-base'
                }`}
            >
                {label}
            </label>

            {/* Password Toggle Button */}
            {showPasswordToggle && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-gray hover:text-primary-black"
                >
                    {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3L21 21M10.5 10.677C10.0353 11.0959 9.75 11.6912 9.75 12.3529C9.75 13.6347 10.7907 14.6765 12.0714 14.6765C12.7326 14.6765 13.3275 14.3912 13.7456 13.9265M17.3571 17.5C15.8714 18.6176 14.0357 19.2941 12 19.2941C7.71429 19.2941 4 16.2353 2.14286 12.3529C3.07143 10.5 4.42857 8.97059 6.07143 7.85294M9.85714 6.35294C10.5714 6.14706 11.2857 6 12 6C16.2857 6 20 9.05882 21.8571 12.9412C21.2143 14.1176 20.4286 15.1765 19.5 16.0588M14.1429 12.9412C13.9286 14.4118 12.7143 15.5882 11.2143 15.7941" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.8701 11.5C21.2301 10.39 17.7101 4.81999 11.7301 4.99999C6.20007 5.13999 3.00007 9.99999 2.13007 11.5C1.95144 11.8094 1.95144 12.1906 2.13007 12.5C2.76007 13.59 6.13007 19 12.0201 19H12.2701C17.8001 18.86 21.0101 14 21.8701 12.5C22.0487 12.1906 22.0487 11.8094 21.8701 11.5ZM12.0001 15.5C10.0671 15.5 8.50007 13.933 8.50007 12C8.50007 10.067 10.0671 8.49999 12.0001 8.49999C13.9331 8.49999 15.5001 10.067 15.5001 12C15.5001 13.933 13.9331 15.5 12.0001 15.5ZM12.0001 13.5C12.8285 13.5 13.5001 12.8284 13.5001 12C13.5001 11.1716 12.8285 10.5 12.0001 10.5C11.1716 10.5 10.5001 11.1716 10.5001 12C10.5001 12.8284 11.1716 13.5 12.0001 13.5Z" fill="currentColor" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
}