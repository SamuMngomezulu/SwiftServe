# SwiftServe - Self-Service Kiosk System

![.NET Core](https://img.shields.io/badge/.NET-6.0-purple)
![Entity Framework Core](https://img.shields.io/badge/EF_Core-6.0-blue)
![SQL Server](https://img.shields.io/badge/SQL_Server-2019-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Project Overview
A modern self-service kiosk solution with user management, wallet integration, and role-based access control built with ASP.NET Core Web API.

## ✨ Features
- **User Management**
  - Registration with email validation
  - Secure password hashing (BCrypt)
- **Wallet System**
  - Balance tracking
  - Transaction history
- **Role-Based Access**
  - Admin/User roles
  - Permission management
- **Product Management**
  - Inventory tracking
  - Category organization

## 🛠 Technology Stack
| Component          | Technology           |
|--------------------|----------------------|
| Backend Framework  | ASP.NET Core 6.0     |
| Database           | SQL Server           |
| ORM                | Entity Framework Core|
| Authentication     | BCrypt.NET           |
| API Documentation  | Swagger UI           |

## 🚀 Getting Started

### Prerequisites
- [.NET 6.0 SDK](https://dotnet.microsoft.com/download)
- [SQL Server 2019+](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [Git](https://git-scm.com/downloads)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SamuMngomezulu/SwiftServe.git
   cd SwiftServe
Configure the database:

Update connection string in appsettings.json:

json
Copy
"ConnectionStrings": {
  "SwiftServeDB": "Server=SLC-SMNGOMEZULU\\SMNGOMEZULU;Database=SwiftServe;Trusted_Connection=True;"
}
Apply database migrations:

bash
Copy
dotnet ef database update
Run the application:

bash
Copy
dotnet run
🌐 API Endpoints
Endpoint	Method	Description
/api/Users/register	POST	Register new user
/api/Users/login	POST	User login (Coming Soon)
/api/Wallets	GET	Get wallet balance (Coming Soon)
📊 Database Schema
mermaid
Copy
erDiagram
    USER ||--o{ ROLE : has
    USER ||--o{ WALLET : has
    USER ||--o{ ORDER : places
    ORDER ||--o{ TRANSACTION : generates
    PRODUCT ||--o{ CATEGORY : belongs
🧪 Testing
Access Swagger UI at https://localhost:<port>/swagger when running the application.

Example registration request:

json
Copy
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
Distributed under the MIT License. See LICENSE for more information.

📧 Contact
Samu Mngomezulu
GitHub
Email

Note: This project is under active development. Check back frequently for updates!

Copy

### Key Features of This README:
1. **Badges** - Visual indicators for technologies and status
2. **Clean Structure** - Organized sections with clear headings
3. **Visual Database Schema** - Mermaid diagram for quick understanding
4. **API Documentation** - Ready-to-use endpoint table
5. **Contributing Guidelines** - Clear instructions for collaborators
6. **Responsive Formatting** - Looks good on GitHub and other platforms

To add this to your project:
1. Create a new file named `README.md` in your project root
2. Paste this content
3. Customize the contact information and any other details
4. Commit and push:
   ```bash
   git add README.md
   git commit -m "Add comprehensive README"
   git push
