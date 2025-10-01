// app/success/SuccessContent.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Button from '../components/Button';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'account' or 'password'

  const content = {
    account: {
      title: 'Account Created Successfully!',
      subtitle: 'Your account has been created successfully. You can now login to your account.',
      buttonText: 'Go To Login',
      buttonLink: '/login'
    },
    password: {
      title: 'Password Changed Successfully!',
      subtitle: 'Your password has been changed successfully. You can now login with your new password.',
      buttonText: 'Go To Login',
      buttonLink: '/login'
    }
  };

  const currentContent = type === 'password' ? content.password : content.account;

  return (
    <div className="min-h-screen bg-primary-white px-4 py-8">
      {/* Logo */}
      <div className="mb-12 md:mb-16">
        <Link href="/">
          <Image
            src="/labfry-logo.png"
            alt="Labfry"
            width={182}
            height={98}
            className="w-28 md:w-32 h-auto"
            priority
          />
        </Link>
      </div>

      {/* Success Content */}
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {/* Success Icon */}
        <div className="mb-8 md:mb-12">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40C0 17.9086 17.9086 0 40 0Z" fill="#06C270" />
              <path d="M40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40C0 17.9086 17.9086 0 40 0Z" stroke="white" />
              <path d="M36.6662 45.2859L51.9862 29.9642L54.3446 32.3209L36.6662 49.9992L26.0596 39.3926L28.4162 37.0359L36.6662 45.2859Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary-black mb-6 md:mb-8 text-center leading-tight">
          {currentContent.title}
        </h1>

        {currentContent.subtitle && (
          <p className="text-primary-gray mb-6 md:mb-8 text-center max-w-md leading-relaxed">
            {currentContent.subtitle}
          </p>
        )}

        {/* Action Button */}
        <div className="w-full max-w-md">
          <Button
            href={currentContent.buttonLink}
            variant="primary"
            className="py-3.5 rounded-lg"
          >
            {currentContent.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}