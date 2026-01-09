import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Info - Dagbok Cloud",
  description:
    "AI-Powered Notes System for professional work logs and personal thoughts",
};

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-start justify-start space-y-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Dagbok (Digital Logbook)
        </h1>
        <p className="text-gray-200">
          AI-Powered Notes System: Simplifying note-taking and organization for
          professional work logs and personal thoughts.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">
          Key Technology Stack
        </h2>
        <ul className="list-inside list-disc space-y-1 text-gray-300">
          <li>Frontend: Next.js (16.1.1) for SSR.</li>
          <li>Backend: Spring Boot (4.0.0) for secure REST API.</li>
          <li>Database: JPA (Hibernate) with MySQL for persistent storage.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Project Resources</h2>
        <ul className="list-none space-y-2 text-gray-300">
          <li>
            <span className="font-medium text-white">GitHub Repository:</span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://github.com/Kirill9m/dagbok-next-boot"
              target="_blank"
              rel="noreferrer"
            >
              Full application source code
            </a>
          </li>
          <li>
            <span className="font-medium text-white">UML Diagrams:</span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://github.com/Kirill9m/dagbok-next-boot/tree/main/documentation"
              target="_blank"
              rel="noreferrer"
            >
              Detailed diagrams
            </a>
          </li>
          <li>
            <span className="font-medium text-white">
              Quick Diagram Viewer:
            </span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="/diagrams"
              target="_blank"
              rel="noreferrer"
            >
              Live iframe
            </a>
          </li>
          <li>
            <span className="font-medium text-white">Project Board:</span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://github.com/users/Kirill9m/projects/2"
              target="_blank"
              rel="noreferrer"
            >
              Public Kanban/issues
            </a>
          </li>
          <li>
            <span className="font-medium text-white">Issue Tracker:</span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://github.com/Kirill9m/dagbok-next-boot/issues"
              target="_blank"
              rel="noreferrer"
            >
              Reported issues & feature requests
            </a>
          </li>
          <li>
            <span className="font-medium text-white">Adr:</span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://github.com/Kirill9m/dagbok-next-boot/tree/main/documentation/adr"
              target="_blank"
              rel="noreferrer"
            >
              Architecture Decision Records
            </a>
          </li>
          <li>
            <span className="font-medium text-white">Figma:</span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://www.figma.com/proto/008738sH9kN19gu2d3neBV/Dagbok-cloud?node-id=0-1&t=6Cb8krVpExcL2pvY-1"
              target="_blank"
              rel="noreferrer"
            >
              Figma prototyp
            </a>
          </li>
          <li>
            <span className="font-medium text-white">QA:</span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="https://github.com/Kirill9m/dagbok-next-boot/blob/main/documentation/QA.md"
              target="_blank"
              rel="noreferrer"
            >
              Quality Assurance
            </a>
          </li>
          <li>
            <span className="font-medium text-white">Prompts:</span>{" "}
            <a
              className="text-blue-400 hover:underline"
              href="/info/prompts"
              target="_blank"
              rel="noreferrer"
            >
              Examples
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
