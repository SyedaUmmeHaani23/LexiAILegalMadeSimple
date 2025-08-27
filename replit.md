# LexiAI - Legal Made Simple

## Overview

LexiAI is a Generative AI-powered Legal Companion that simplifies complex legal documents into clear, accessible, and actionable guidance for everyday users. The platform enables individuals, small businesses, and NGOs to understand their rights, obligations, and risks in legal documents without requiring expensive legal consultation. The application provides AI-powered document analysis, clause-by-clause explanations, interactive chatbot assistance, and a comprehensive legal glossary.

## Project Status

**Current State**: Fully functional MVP deployed on Replit  
**Last Updated**: January 26, 2025  
**Version**: 1.0 - Complete MVP Implementation

## Recent Changes

- ✅ Migrated complete application from external project to Replit platform
- ✅ Integrated OpenAI API for AI-powered legal document analysis and chatbot
- ✅ Enhanced UI with bright, modern design using animations and gradients
- ✅ Implemented all core MVP features: authentication, document upload, analysis, and chat
- ✅ Fixed all component compatibility issues and TypeScript errors
- ✅ Added comprehensive document management and analysis dashboard

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite for fast development and hot module replacement
- **UI Components**: shadcn/ui component library based on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the entire stack
- **API Design**: RESTful API endpoints with structured JSON responses
- **File Upload**: Multer middleware for handling document uploads with file type validation
- **AI Integration**: OpenAI GPT-5 API for legal document analysis and natural language processing

### Authentication & Authorization
- **Authentication Provider**: Replit Auth using OpenID Connect (OIDC) protocol
- **Session Management**: Express sessions with PostgreSQL session store using connect-pg-simple
- **Security**: JWT-based authentication with secure HTTP-only cookies
- **User Management**: Mandatory user table structure for Replit Auth compliance

### Database Design
- **Database**: PostgreSQL with Neon serverless infrastructure
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Structure**:
  - Users table for authentication and profile management
  - Documents table for uploaded file metadata and processing status
  - Document analysis table for AI-generated summaries and insights
  - Clauses table for granular document breakdown with risk categorization
  - Chat conversations and messages for interactive AI assistance
  - Glossary terms for legal definitions and explanations

### AI Processing Pipeline
- **Document Analysis**: Multi-stage AI processing to extract obligations, risks, and deadlines
- **Clause Classification**: Automatic categorization of document clauses by type and risk level
- **Natural Language Generation**: Plain-English explanations with actionable advice
- **Interactive Q&A**: Context-aware chatbot powered by document content and legal knowledge

### File Processing
- **Supported Formats**: PDF, Word documents (.docx, .doc), and plain text files
- **File Validation**: Size limits (10MB) and MIME type checking for security
- **Text Extraction**: Document parsing pipeline for content extraction and analysis
- **Storage**: Local file system storage with organized upload directory structure

## External Dependencies

### AI Services
- **OpenAI API**: GPT-5 model for legal document analysis, clause explanation, and interactive chat functionality
- **API Configuration**: Environment-based API key management with fallback handling

### Database Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Database Connection**: WebSocket-based connection using @neondatabase/serverless driver
- **Session Storage**: PostgreSQL-backed session store for authentication persistence

### Authentication Services
- **Replit Auth**: OpenID Connect provider for user authentication and profile management
- **Session Management**: Secure session handling with configurable TTL and cookie settings

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Icon library for consistent iconography across the application
- **Class Variance Authority**: Utility for creating consistent component variants

### Development Tools
- **TypeScript**: Type safety and developer experience across frontend and backend
- **Vite**: Fast build tool with hot module replacement and development server
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **ESBuild**: Fast JavaScript bundler for production builds

### File Upload & Processing
- **Multer**: Express middleware for handling multipart/form-data and file uploads
- **File System**: Node.js fs module for file operations and storage management