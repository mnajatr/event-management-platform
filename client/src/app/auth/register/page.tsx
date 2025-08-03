import RegisterForm from "@/components/forms/registerForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SIDE IMAGE & TEXT */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#111827] relative">
        <Image
          src="/hero-register.jpg" // Make sure this image is in /public
          alt="Hero Illustration"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
        <div className="absolute z-10 text-center px-10 text-white max-w-md">
          <h1 className="text-3xl font-bold mb-4">
            You can attend events as you wish,
            <br /> but your wallet remains safe!
          </h1>
          <p className="text-sm text-gray-200">
            Create an account to get cheaper prices, extra discounts, & free
            insurance.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <RegisterForm />
      </div>
    </div>
  );
}