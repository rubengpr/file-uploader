# File Uploader

A modern web application for managing and organizing files with a beautiful user interface. Built with React, TypeScript, and Supabase.

## Features

- 📁 **File Management**
  - Upload files (max 20MB)
  - Create and manage folders
  - Rename files and folders
  - Delete files and folders
  - Download files
  - Share files via generated URLs

- 🔍 **Advanced Features**
  - File sorting by name, type, size, creation date, and creator
  - File filtering by type and date
  - Search functionality
  - File size formatting
  - Secure file storage with Supabase

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark mode interface
  - Interactive file operations
  - Toast notifications for user feedback
  - Modal dialogs for important actions

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- React Hot Toast for notifications
- Font Awesome for icons

### Backend
- Supabase for file storage and database
- RESTful API endpoints for file operations
- JWT authentication

## Project Structure

```
frontend/
├── src/
│   ├── api/         # API integration
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── routes/      # Route definitions
│   ├── stores/      # State management
│   ├── styles/      # Global styles
│   └── utils/       # Utility functions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the frontend directory with:
   ```
   VITE_API_URL=your_api_url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## File Operations

The application provides a comprehensive set of file operations through the `useFileOperations` hook:

- `uploadFile`: Upload new files
- `shareFile`: Generate shareable URLs
- `renameFile`: Rename files and folders
- `handleFileChange`: Handle file input changes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
