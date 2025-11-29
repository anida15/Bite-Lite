# Bite Lite - Food Delivery Service

A modern food delivery e-commerce application built with React, TypeScript, and HeroUI.

## 🚀 Instructions to Run the App

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Bite Lite"
```

2. Install dependencies:
```bash
npm install
```

Or using other package managers:
```bash
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env` file in the root directory with the following environment variables:
```env
VITE_API_ECOMMERCE_CORE_URL=your_api_base_url
VITE_ENCRYPTION_KEY=your_encryption_key
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Setup pnpm (optional)

If you are using `pnpm`, add the following to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

Then run `pnpm install` again.

## 🛠️ Tech Stack

### Core Framework & Build Tools
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[React](https://react.dev/)** (v18.3.1) - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React Router DOM](https://reactrouter.com/)** (v6.23.0) - Client-side routing

### UI & Styling
- **[HeroUI](https://heroui.com)** (v2) - Modern React component library
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.1.11) - Utility-first CSS framework
- **[Tailwind Variants](https://tailwind-variants.org/)** - Component variant styling
- **[Framer Motion](https://www.framer.com/motion/)** (v11.18.2) - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

### State Management & Data Fetching
- **[Zustand](https://zustand-demo.pmnd.rs/)** (v5.0.8) - Lightweight state management
- **[TanStack React Query](https://tanstack.com/query)** (v5.90.7) - Data fetching and caching

### HTTP Client & Utilities
- **[Axios](https://axios-http.com/)** (v1.13.2) - HTTP client for API requests
- **[CryptoJS](https://cryptojs.gitbook.io/)** (v4.2.0) - Encryption library for secure storage
- **[clsx](https://github.com/lukeed/clsx)** - Utility for constructing className strings

## 📦 State Management

The application uses **Zustand** for global state management with encrypted persistence.

### Implementation Details

- **Store Location**: `src/pages/data/Store.ts`
- **Persistence**: State is persisted to localStorage using encrypted storage
- **Encryption**: Uses AES encryption via CryptoJS to secure cart data
- **Storage Key**: `cart-store` (configurable in the store setup)

### Key Features

- **Cart Management**: Stores cart items with quantities and product details
- **Encrypted Persistence**: All cart data is encrypted before being stored in localStorage
- **Type Safety**: Fully typed with TypeScript interfaces
- **Computed Values**: Includes helper functions for calculating cart totals

### Usage Example

```typescript
import useStore from "@/pages/data/Store";

const MyComponent = () => {
  const { cartItems, setCartItems } = useStore();
  
  // Access cart items
  // Update cart items
};
```

## 🌐 API Handling

The application uses **Axios** with a centralized instance and interceptors for API communication.

### Implementation Details

- **Base Configuration**: `src/constants.ts`
- **API Instance**: `coreAxiosInstance` - Pre-configured Axios instance
- **Base URL**: Configured via `VITE_API_ECOMMERCE_CORE_URL` environment variable
- **Request Interceptors**: Automatically adds Bearer token from sessionStorage to all requests

### Key Features

- **Centralized Configuration**: Single Axios instance for all API calls
- **Automatic Authentication**: Request interceptor adds JWT token from sessionStorage
- **Error Handling**: Structured error handling with type checking
- **Loading States**: API functions manage loading states via callbacks
- **Message Notifications**: Integrated with message context for user feedback

### API Functions

API functions are located in `src/pages/data/api.ts`:

- `apiGetProductsStock()` - Fetches products with pagination, filtering, and search
- `apiGetCategories()` - Fetches product categories

### Usage Pattern

```typescript
import { coreAxiosInstance } from "@/constants";

// API calls automatically include:
// - Base URL from environment variable
// - Authorization header (if token exists in sessionStorage)
// - JSON content type headers
```

### Request Flow

1. API function is called with required parameters
2. Loading state is set to `true`
3. Request interceptor adds authentication token (if available)
4. Request is sent to the configured base URL
5. Response is processed and returned
6. Loading state is set to `false`
7. Errors are caught and displayed via message context

## 📝 License

Licensed under the [MIT license](https://github.com/heroui-inc/vite-template/blob/main/LICENSE).
