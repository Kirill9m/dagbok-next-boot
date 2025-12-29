import AppPreview from "@/app/components/AppPreview";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-3xl font-bold text-white mb-2">Dagbok Cloud</h1>

      <p className="text-gray-300 mb-8 max-w-xl">
        Work in progress — a time reporting system currently under development.
      </p>

      <div className="w-full max-w-4xl">
        <AppPreview />
      </div>
    </div>
  );
}
