# Dakota Task Manager

A complete solution for task management, built with **React**, **TypeScript**, and **Vite**.

## 🚀 Overview
This application is a robust Task Manager featuring secure authentication, CRUD operations, localization, and a responsive design. It was built with clean architecture in mind, using a modular file structure.

## 🛠 Tech Stack
* **Frontend:** React, TypeScript, Vite
* **Routing:** React Router
* **Styling:** CSS
* **API Handling:** Axios/Fetch
* **State Management:** React Hooks (useState, useEffect)

* <img width="1844" height="900" alt="image" src="https://github.com/user-attachments/assets/d347af94-89b8-4ce8-8e7f-3404ee53398d" />
<img width="1827" height="892" alt="image" src="https://github.com/user-attachments/assets/bfcdb215-d92d-4539-b545-902ccbb2bde1" />



## 📂 Project Structure
```text
my-task-manager(frontend)/
├── assets/          # Static assets
├── components/      # UI Components (Header, TaskItem, AddTask, etc.)
├── hoc/             # Protected Routes logic
├── interfaces/      # Type definitions
├── locales/         # Language files (en, uk)
├── pages/           # Page layouts
├── services/        # API calls
├── styles/          # Global & component styles
└── utils/           # Helper functions

TaskManager.Api(backend)/
├── Data/              # DbContext, database configurations & schemas
├── Endpoints/         # API controllers/minimal API handlers
├── Migrations/        # Entity Framework database migration history
├── Models/            # Domain entities and Data Transfer Objects (DTOs)
├── Validation/        # Request validation logic (e.g., FluentValidation)
├── appsettings.json   # Configuration (hidden)
└── Program.cs         # Application entry point & service registration
