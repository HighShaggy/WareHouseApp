# 🏭 Warehouse Management System

![.NET Core](https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQL Server](https://img.shields.io/badge/Microsoft_SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)

Система мониторинга склада.

## 📝 Описание проекта

Проект представляет собой веб-приложение для автоматизации складского учёта, состоящее из:
- **Backend**: ASP.NET Core Web API
- **Frontend**: React.js
- **Database**: MS SQL Server

## 🎯 Цель проекта
Разработка системы, позволяющей:
- Управлять ресурсами и единицами измерения
- Оформлять документы поступления и отгрузки

## ⚙️ Функционал

### 🔹 Общий функционал
- Справочники ресурсов и единиц измерения
- Валидация данных на сервере
- Валидация бизнес-правил
- Базовые CRUD-операции
- Простая фильтрация
- Основные справочники
- Архивация сущностей


## 🛠️ Технологии

### Backend
- ASP.NET Core 
- LINQ, Entity Framework Core
- Swagger/OpenAPI

### Frontend
- React 
- Material-UI
- Axios
- Redux Toolkit

### Database
- MS SQL Server 2022
- Entity Framework Core Migrations

## 🚀 Запуск проекта

### Предварительные требования
- .NET 6 SDK
- Node.js 16+
- SQL Server 2012+

### Установка
```bash
# Backend
cd back
dotnet restore
dotnet ef database update
dotnet run

# Frontend
cd front
npm install
npm start
