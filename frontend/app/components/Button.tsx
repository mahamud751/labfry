// components/Button.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  icon,
  disabled = false
}: ButtonProps) {
  const baseClasses = 'w-full flex items-center justify-center gap-4 px-6 py-5 rounded-2xl text-xl leading-7 font-semibold transition-colors group';

  const variantClasses = {
    primary: `bg-primary-red text-primary-white shadow-lg shadow-primary-red/24 ${!disabled ? 'hover:bg-red-600' : ''}`,
    secondary: `bg-background-gray border-2 border-border-gray text-primary-black ${!disabled ? 'hover:bg-gray-50' : ''}`,
    outline: `bg-primary-red/10 border-2 border-primary-red text-primary-red ${!disabled ? 'hover:bg-red-100' : ''}`
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className} ${!disabled ? 'cursor-pointer' : ''}`;

  const buttonContent = (
    <>
      {children}
      {icon && (
        <span className="transition-transform group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
}

// Arrow icon components for reusability
export const ArrowIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.172 10.9997L10.808 5.63568L12.222 4.22168L20 11.9997L12.222 19.7777L10.808 18.3637L16.172 12.9997H4V10.9997H16.172Z" fill={color} />
  </svg>
);