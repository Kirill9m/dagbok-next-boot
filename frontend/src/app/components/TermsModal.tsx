import { FC, useEffect, useRef } from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A]/50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-[#2A2A2A] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 id="modal-title" className="mb-6 text-3xl font-bold">
          Användarvillkor
        </h1>

        <section className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">
            1. Användning av tjänsten
          </h2>
          <p>
            Du använder denna tjänst på egen risk. Tjänsten tillhandahålls i{" "}
            <strong>demonstrationsläge</strong>, och vi garanterar inte att den
            är tillgänglig 24/7. Vi förbehåller oss rätten att ändra, begränsa
            eller stänga tjänsten när som helst utan föregående meddelande.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">2. Data och sekretess</h2>
          <p>
            Vi samlar endast in ditt användarnamn och dina anteckningar.
            Lösenord lagras <strong>krypterade med bcrypt</strong>. Kodbasen är{" "}
            <strong>offentlig på GitHub</strong>. Vissa data kan skickas via
            externa tjänster, t.ex. OpenRouter, och kan i framtiden även
            krypteras under överföring. Vi kan inte garantera att data aldrig
            går förlorad, läcker eller missbrukas. Använd därför inte tjänsten
            för känslig eller konfidentiell information.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">3. Ansvarsbegränsning</h2>
          <p>
            Vi tar <strong>inget ansvar</strong> för direkta eller indirekta
            skador, förluster eller kostnader som kan uppstå vid användning av
            tjänsten, inklusive men inte begränsat till dataförlust, driftstopp
            eller andra problem.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">
            4. Registrering och användarkonto
          </h2>
          <p>
            Genom att skapa ett konto bekräftar du att du har läst och
            accepterar dessa villkor. Du ansvarar själv för säkerheten kring
            ditt användarnamn och lösenord.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">
            5. Ändringar av villkoren
          </h2>
          <p>
            Vi förbehåller oss rätten att ändra dessa villkor när som helst.
            Ändringar träder i kraft omedelbart efter publicering.
          </p>
        </section>

        <p className="mt-6 text-sm text-gray-400">
          Observera att tjänsten är i demonstrationsläge och kan vara
          otillgänglig när som helst. Använd tjänsten på egen risk.
        </p>

        <button
          onClick={onClose}
          className="mt-4 rounded bg-[#FF7518] px-4 py-2 text-white hover:bg-[#ff8833]"
        >
          Stäng
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
