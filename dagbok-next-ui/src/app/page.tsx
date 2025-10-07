import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="mb-6">
        <Image
          src="/icon.svg"
          alt="Dagbok Cloud Logo"
          width={100}
          height={100}
          priority
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dagbok Cloud</h1>
      <p className="text-lg text-gray-600">
        Work In Progress: Time Reporting System is currently under development.
      </p>
    </div>
  );
}
