# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - starts Vite dev server with hot reload
- **Build**: `npm run build` - creates production build
- **Lint**: `npm run lint` - runs ESLint on all files
- **Preview**: `npm run preview` - preview production build locally

## Architecture Overview

This is a React TypeScript application using Vite as the build tool, designed as a customer support portal for a smart home service provider.

### Core Structure

- **Context-based State Management**: Uses React Context for authentication (`AuthContext`) and customer management (`CustomerContext`)
- **Route Protection**: Authentication-gated routing with conditional rendering based on user login status
- **Component Organization**: 
  - `components/auth/` - Authentication components
  - `components/layout/` - Layout components (Header, Sidebar, Layout wrapper)
  - `components/modals/` - Modal dialogs (CustomerSearchModal, DPAModal)
  - `pages/` - Main page components
  - `contexts/` - React Context providers
  - `types/` - TypeScript type definitions

### Key Patterns

- **Authentication Flow**: Mock OAuth2 implementation with localStorage token persistence
- **Customer Management**: DPA (Data Protection Act) verification system with attempt tracking
- **Type Safety**: Comprehensive TypeScript interfaces for User, Customer, Subscription, Device, and audit entities
- **UI Framework**: Tailwind CSS for styling with Lucide React for icons

### Main User Roles
- `tier1`, `tier2`, `admin` with permission-based access control

### Domain Entities
- Users with role-based permissions
- Customers with subscription and device management
- Devices (thermostat, camera, doorbell, sensor, hub) with connectivity monitoring
- Subscription plans (free, plus, pro) with change history tracking
- DPA verification and audit logging system