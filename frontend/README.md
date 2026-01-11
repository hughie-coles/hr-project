# HR Platform Frontend

This is the frontend application for the HR Platform, built with Next.js, React, and TypeScript.

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Running in Docker

The frontend can also be run using Docker Compose from the project root:

```bash
docker compose up frontend
```

## Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Testing

This project uses [Vitest](https://vitest.dev/) for unit testing and [React Testing Library](https://testing-library.com/react) for component testing.

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode (automatically re-runs tests on file changes):

```bash
npm test -- --watch
```

Run tests with coverage:

```bash
npm test -- --coverage
```

Run tests in UI mode (interactive test runner):

```bash
npm test -- --ui
```

### Test Structure

- Tests are located in the `test/` directory
- Test files follow the naming pattern: `*.test.{ts,tsx}`
- The test setup file is located at `test/setup.ts`

### Writing Tests

Example test structure:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../components/MyComponent'

describe('MyComponent', () => {
    it('renders correctly', () => {
        render(<MyComponent />)
        expect(screen.getByText('Hello')).toBeInTheDocument()
    })

    it('handles user interactions', async () => {
        const user = userEvent.setup()
        render(<MyComponent />)
        const button = screen.getByRole('button')
        await user.click(button)
        // Assert expected behavior
    })
})
```

### Test Configuration

The test configuration is defined in `vitest.config.ts`. Key settings:

- **Environment**: jsdom (for DOM testing)
- **Globals**: Enabled (no need to import `describe`, `it`, `expect`, etc.)
- **Setup Files**: `test/setup.ts` (runs before each test file)

### Running Tests in Docker

To run tests inside the Docker container:

```bash
docker compose exec frontend npm test
```

Or run a specific test file:

```bash
docker compose exec frontend npm test -- test/Nav.test.tsx
```

## Linting

Run the linter:

```bash
npm run lint
```

## Project Structure

```
frontend/
├── components/          # Reusable React components
├── context/            # React context providers (e.g., AuthContext)
├── pages/              # Next.js pages (routes)
├── styles/             # Global CSS styles
├── test/               # Test files
├── public/             # Static assets
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vitest.config.ts    # Vitest test configuration
```

## Technologies

- **Next.js 13**: React framework for production
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vitest**: Fast unit test framework
- **React Testing Library**: Simple and complete testing utilities

## Environment Variables

The frontend connects to the backend API. The API proxy is configured in `next.config.js` to forward requests from `/api/*` to the backend service.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Vitest Documentation](https://vitest.dev)
- [React Testing Library Documentation](https://testing-library.com/react)
