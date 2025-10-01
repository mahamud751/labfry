// app/select-role/page.tsx
import Image from "next/image";
import Button, { ArrowIcon } from "../components/Button";

export default function SelectRolePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-white px-4 py-8">
      {/* Logo */}
      <div className="mb-8 md:mb-12">
        <Image
          src="/labfry-logo.png"
          alt="Labfry"
          width={182}
          height={98}
          className="w-36 md:w-44 h-auto"
          priority
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-black text-center mb-2 leading-tight">
          Select a Role
        </h1>
        <p className="text-primary-gray font-semibold text-center mb-8 md:mb-10 leading-relaxed">
          Choose the option that best describes you so we can tailor your
          experience.
        </p>

        {/* Role Selection Buttons */}
        <div className="space-y-4 md:space-y-5">
          <Button
            href="/register?role=CUSTOMER"
            variant="outline"
            icon={<ArrowIcon color="#EE3638" />}
          >
            I&apos;m a Customer
          </Button>

          <Button
            href="/register?role=USER"
            variant="secondary"
            icon={<ArrowIcon color="#111111" />}
          >
            I&apos;m a Service Provider
          </Button>
        </div>
      </div>
    </div>
  );
}
