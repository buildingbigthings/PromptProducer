# Prompt Producer - AI Prompt Builder Application

## Overview

This is a full-stack web application called "Prompt Producer" that helps users create professional AI prompts without being prompt engineering experts. The app features a React frontend with TypeScript, an Express.js backend, and uses PostgreSQL with Drizzle ORM for data persistence. It provides structured forms for different content types (blogs, emails, social media, etc.) and integrates with OpenAI's API to generate optimized prompts.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured JSON responses
- **Middleware**: Custom logging, error handling, and request parsing
- **Development**: Hot reload with tsx and Vite dev server integration

### Database Layer
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Connection**: WebSocket-based connection pooling for serverless environments
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Template System
- Modular prompt templates for different content types (blogs, emails, social media, etc.)
- Form field definitions with validation and help text
- Dynamic prompt generation based on user inputs

### AI Integration
- OpenAI GPT-4o integration for prompt enhancement and generation
- Custom prompt engineering logic for different content categories
- Refinement system for iterative prompt improvement

### User Experience Features
- Role-based prompt customization (SEO strategist, content creator, etc.)
- Goal-oriented prompt optimization (inform, persuade, sell, etc.)
- Real-time prompt preview and refinement
- Copy-to-clipboard functionality with visual feedback

### Content Management
- Prompt history storage with favorites and tagging
- Search and filtering capabilities
- Notes and categorization system

## Data Flow

1. **User Input**: Users select a template or use the open prompt builder
2. **Form Processing**: Frontend validates and structures form data
3. **AI Processing**: Backend sends structured data to OpenAI API for prompt generation
4. **Response Handling**: Generated prompts are processed and formatted
5. **Storage**: Prompts are saved to PostgreSQL with metadata
6. **Display**: Optimized prompts are shown with refinement options

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **openai**: Official OpenAI API client
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **drizzle-kit**: Database schema management
- **tailwindcss**: Utility-first CSS framework

### Authentication & Session Management
- **connect-pg-simple**: PostgreSQL session store (prepared for future auth implementation)

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles TypeScript server to `dist/index.js`
- Environment: Node.js 20 with ES modules support

### Hosting Configuration
- **Platform**: Replit with autoscale deployment
- **Port**: 5000 (internal) mapped to 80 (external)
- **Database**: PostgreSQL 16 module with connection pooling
- **Environment Variables**: DATABASE_URL and OPENAI_API_KEY required

### Development Workflow
- **Dev Command**: `npm run dev` - runs server with hot reload
- **Build Command**: `npm run build` - creates production bundle
- **Start Command**: `npm run start` - runs production server

## Changelog

- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.