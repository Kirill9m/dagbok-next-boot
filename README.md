# Dagbok — a smart calendar

**A full-stack project with a focus on simple design, flexibility, and the integration of artificial intelligence into everyday tasks.**

**Next.js & Spring Boot**

How to run in dev mode:
1. Clone the repository:

   ```bash
   git clone https://github.com/Kirill9m/dagbok-next-boot.git
2. Make sure you have Docker, Node and Maven installed
3. Navigate to the project root directory:

   ```bash
   cd dagbok-next-boot
   and run the following commands in separate terminal windows:
   npm run install (make sure to run this command only once to install dependencies)
   npm run dev to start the Next.js frontend and backend in development mode.
   npm run backend to start only the Spring Boot backend.
   npm run frontend to start only the Next.js frontend.
   ```
4. Open your browser and go to http://localhost:3000 to access the application.
5. To make OpenAI API calls work, create a .env file in the root directory and add your OpenAI API key:

   ```plaintext
   OPENAI_API_KEY=your_openai_api_key_here
   ```
6. Check for .env.example for other environment variables that can be set for development.

🚀 Project Deployment

At the moment, the project is fully deployed using Docker and is publicly accessible via Cloudflare.

The application runs inside Docker containers managed with Docker Compose, which ensures a consistent and reproducible environment across different systems.

Cloudflare is used as a reverse proxy and CDN to provide:

Secure HTTPS access

Improved performance

Protection and reliability

🌐 Live URL: https://dagbok.cloud/

![dev.png](public/dev.png)


## Useful Links:

- [Testing Spring REST APIs with RestTestClient (Springboot 4.0)](https://www.danvega.dev/blog/spring-framework-7-rest-test-client)