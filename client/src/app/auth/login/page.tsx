import LoginForm from "@/components/forms/loginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SIDE IMAGE & TEXT */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#111827] relative">
        <Image
          src="/hero-login.jpg"
          alt="Hero Login Illustration"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
        <div className="absolute z-10 text-center px-10 text-white max-w-md">
          <h1 className="text-3xl font-bold mb-4">
            Log in to enjoy all the benefits!
          </h1>
          <p className="text-sm text-gray-200">
            You only need to enter your cellphone number or email. Easy and fast,
            immediately feel the various conveniences and benefits of our services!
          </p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <LoginForm />
      </div>
    </div>
  );
}