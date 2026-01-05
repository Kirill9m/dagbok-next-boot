import AppPreview from "@/app/components/AppPreview";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-3xl font-bold text-white">Dagbok Cloud</h1>

      <p className="mb-8 max-w-xl text-gray-300">
        Work in progress — a time reporting system currently under development.
      </p>

      <div className="w-full max-w-4xl">
        <AppPreview />
      </div>
    </div>
  );
}
