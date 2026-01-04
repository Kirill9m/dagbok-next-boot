# Architecture Decision Record (ADR)

## 0001. Why We Chose Next.js, Spring Boot, and MySQL

| Key | Value      |
| :--- |:-----------|
| **Status** | Accepted   |
| **Date** | 01/11/2025 |
| **Author** | Kirill     |

---

## Context (The Problem We Solved)

We needed to pick the right technologies to build **Dagbok**, our time tracking and planning tool. The project has to be solid enough for professional work logs but flexible enough to grow into something bigger—especially with adding AI features for casual notes, like recipes or shopping lists. We basically needed a modern, stable core that won't break later.

## Decision (What We Picked)

We decided to go with a "best of both worlds" approach by splitting the application:

* **Frontend (The UI):** **Next.js**
* **Backend (The Logic and API):** **Spring Boot** (Java)
* **Database:** **MySQL** using **JPA**

## Why This Stack

### Next.js (Frontend)

This is a very modern, convenient framework that makes development easy. More importantly, it gives us super-fast performance and is built to scale up the user interface smoothly. We chose it because it’s a robust choice for a modern web application.

### Spring Boot / Java (Backend)

This is our foundation for stability. Java and Spring have been used successfully for decades and have huge community support. This guarantees **excellent stability**, security, and a massive library of ready-made solutions for anything we might need down the road. It’s our reliable, enterprise-grade core.

### MySQL/JPA (Database)

It’s a classic, proven combination. We chose this for reliability and the huge existing knowledge base. We know it works and it’s solid for data storage.

### Decoupled Architecture

Keeping the Next.js UI separate from the Spring Boot API means each side can be developed and scaled independently. This is key for future growth and adding complex features like AI without breaking everything.

---