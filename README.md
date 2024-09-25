# Building a Backend API for a Simple Inventory Management System using Django Rest Framework

## Introduction

This project involves building a backend API for a simple Inventory Management System using the Django Rest Framework (DRF). The API supports CRUD (Create, Read, Update, Delete) operations for inventory items, secured with JWT-based authentication to restrict access. The system is backed by a PostgreSQL database, uses Redis for caching frequently accessed items, and is equipped with unit tests to ensure the functionality of the API. Furthermore, a logging system is integrated for debugging and monitoring purposes.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Item CRUD Endpoints](#item-crud-endpoints)
  - [Redis Caching](#redis-caching)
- [Logging](#logging)
- [Testing](#testing)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

## Features

- **JWT Authentication**: Secure access to API endpoints using JSON Web Tokens (JWT).
- **CRUD Operations**: Endpoints for creating, reading, updating, and deleting inventory items.
- **PostgreSQL Database**: Store inventory items and manage them via Django ORM.
- **Redis Caching**: Cache frequently accessed items to improve performance.
- **Logging**: Capture API usage and errors using a logger for monitoring.
- **Unit Tests**: Comprehensive unit tests for all API functionalities.
  
## Requirements

- Python 3.x
- Django 4.x
- Django Rest Framework (DRF)
- PostgreSQL
- Redis
- djangorestframework-simplejwt (for JWT)
- Django’s test framework

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd inventory-management-api
