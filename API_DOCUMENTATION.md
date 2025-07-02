# File Uploader - Comprehensive API Documentation

## Table of Contents

1. [Backend REST API](#backend-rest-api)
2. [Frontend Components](#frontend-components) 
3. [React Hooks](#react-hooks)
4. [Utility Functions](#utility-functions)
5. [API Integration Layer](#api-integration-layer)
6. [Types & Interfaces](#types--interfaces)

---

## Backend REST API

### Base URL
- Production: `https://folded.me/api`
- Development: `http://localhost:4000/api`

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Rate Limiting
- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses

---

## Authentication Endpoints (`/api/auth`)

### POST `/api/auth/login`
Authenticate a user and return access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "jwt_access_token",
  "stoken": "supabase_token", 
  "userId": "user_id"
}
```

**Errors:**
- `401`: Invalid email or password
- `500`: Server error

**Usage Example:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "token": "jwt_access_token"
}
```

**Errors:**
- `400`: Missing fields or email already registered
- `500`: Signup failed

### POST `/api/auth/recover-password`
Request a password recovery email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "We've sent you an email"
}
```

### POST `/api/auth/change-password`
Change password using recovery token.

**Request Body:**
```json
{
  "password": "newpassword123",
  "token": "recovery_token"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully",
  "authToken": "new_jwt_token"
}
```

### POST `/api/auth/refresh`
Refresh access token using refresh token cookie.

**Response (200):**
```json
{
  "token": "new_jwt_token"
}
```

---

## File Management Endpoints (`/api/file`)

### POST `/api/file/create`
Create a new file record in the database.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "document.pdf",
  "size": 2048576,
  "folderId": "folder_id_or_null",
  "type": "application/pdf"
}
```

**Response (200):**
```json
{
  "message": "File uploaded successfully"
}
```

**Validation Rules:**
- File name max 60 characters
- File size max 20MB
- Allowed extensions: pdf, doc, docx, xls, xlsx, csv, txt, jpg, jpeg, png, gif, webp, bmp, svg

**Usage Example:**
```javascript
const fileData = {
  name: file.name,
  size: file.size,
  type: file.type,
  folderId: currentFolderId
};

const response = await axios.post('/api/file/create', fileData, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### GET `/api/file/get/:folderId`
Retrieve all files in a specific folder.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `folderId`: Folder ID or "root" for root directory

**Response (200):**
```json
[
  {
    "id": "file_id",
    "name": "document.pdf",
    "size": 2048576,
    "type": "document",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "createdBy": "user_id",
    "folderId": "folder_id",
    "user": {
      "email": "user@example.com"
    }
  }
]
```

**Usage Example:**
```javascript
const files = await axios.get(`/api/file/get/${folderId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### PATCH `/api/file/rename`
Rename a file.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fileId": "file_id",
  "itemName": "new_filename.pdf"
}
```

**Response (200):**
```json
{
  "message": "File renamed successfully"
}
```

### DELETE `/api/file/delete`
Delete a file.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fileId": "file_id"
}
```

**Response (200):**
```json
{
  "message": "File deleted successfully"
}
```

---

## Folder Management Endpoints (`/api/folder`)

### POST `/api/folder/create`
Create a new folder.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Documents",
  "parentId": "parent_folder_id_or_null"
}
```

**Response (201):**
```json
{
  "message": "Folder created successfully"
}
```

**Validation Rules:**
- Folder name 1-60 characters
- Name is sanitized for filesystem safety

### GET `/api/folder/get/:folderId`
Get all subfolders in a folder.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `folderId`: Parent folder ID or "root"

**Response (200):**
```json
[
  {
    "id": "folder_id",
    "name": "Documents",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "createdBy": "user_id",
    "parentId": "parent_id",
    "user": {
      "email": "user@example.com"
    }
  }
]
```

### PATCH `/api/folder/rename`
Rename a folder.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "folderId": "folder_id",
  "itemName": "New Folder Name"
}
```

**Response (200):**
```json
{
  "message": "Folder renamed successfully"
}
```

### DELETE `/api/folder/delete`
Delete a folder and all its contents.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "folderId": "folder_id"
}
```

**Response (200):**
```json
{
  "message": "Folder deleted successfully"
}
```

---

## User Profile Endpoints (`/api/profile`)

### GET `/api/profile/me`
Get current user profile information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "fullname": "John Doe",
    "country": "United States",
    "role": "admin",
    "language": "en",
    "timezone": "America/New_York"
  }
}
```

### PATCH `/api/profile/update`
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "draftFullname": "Jane Doe",
  "draftCountry": "Canada", 
  "draftLanguage": "en",
  "draftTimezone": "America/Toronto"
}
```

**Response (200):**
```json
{
  "message": "User updated successfully"
}
```

---

## Frontend Components

### Table Component
Main component for displaying files and folders with interactive operations.

**Import:**
```tsx
import Table from '@/components/Table';
```

**Props Interface:**
```tsx
interface TableProps {
  files: AppFile[];
  folders: AppFolder[];
  sortDirection: string;
  sortKey: keyof AppFile | null;
  onUpdate: (folderId: string) => void;
  onFolderClick: (folderId: string) => void;
  onHeaderClick: (key: keyof AppFile) => void;
  isShareModalOpen: boolean;
  toggleShareModal: () => void;
  isRenameModalOpen: boolean;
  toggleRenameModal: () => void;
  isDeleteModalOpen: boolean;
  toggleDeleteModal: () => void;
}
```

**Usage Example:**
```tsx
<Table
  files={files}
  folders={folders}
  sortDirection={sortDirection}
  sortKey={sortKey}
  onUpdate={handleUpdate}
  onFolderClick={handleFolderClick}
  onHeaderClick={handleHeaderClick}
  isShareModalOpen={isShareModalOpen}
  toggleShareModal={toggleShareModal}
  isRenameModalOpen={isRenameModalOpen}
  toggleRenameModal={toggleRenameModal}
  isDeleteModalOpen={isDeleteModalOpen}
  toggleDeleteModal={toggleDeleteModal}
/>
```

**Features:**
- Sortable columns (name, date, type, size, creator)
- Context menu for file/folder operations
- Drag and drop support
- Modal dialogs for rename, delete, share operations
- Responsive design

### Button Component
Reusable button component with consistent styling.

**Import:**
```tsx
import Button from '@/components/Button';
```

**Props:**
```tsx
interface ButtonProps {
  buttonText: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}
```

**Usage Example:**
```tsx
<Button
  buttonText="Upload File"
  onClick={handleUpload}
  type="button"
  disabled={isUploading}
/>
```

### Modal Component
Generic modal component for dialogs and overlays.

**Import:**
```tsx
import Modal from '@/components/Modal';
```

**Props:**
```tsx
interface ModalProps {
  modalTitle: string;
  modalText: string;
  onClose: () => void;
  children: React.ReactNode;
}
```

**Usage Example:**
```tsx
<Modal
  modalTitle="Delete File"
  modalText="Are you sure you want to delete this file?"
  onClose={closeModal}
>
  <div className="flex gap-4">
    <Button buttonText="Cancel" onClick={closeModal} />
    <Button buttonText="Delete" onClick={confirmDelete} />
  </div>
</Modal>
```

### Form Components

#### LabelInput
Input component with integrated label and validation styling.

**Props:**
```tsx
interface LabelInputProps {
  label: string;
  name: string;
  type: string;
  inputSize?: 'sm' | 'md' | 'lg';
  onValueChange: (value: string) => void;
}
```

**Usage:**
```tsx
<LabelInput
  label="File Name"
  name="fileName"
  type="text"
  inputSize="md"
  onValueChange={setFileName}
/>
```

#### Input
Basic input component.

**Props:**
```tsx
interface InputProps {
  type: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}
```

#### Selector
Dropdown selection component.

**Props:**
```tsx
interface SelectorProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

### Navigation Components

#### Sidebar
Main navigation sidebar component.

**Import:**
```tsx
import Sidebar from '@/components/Sidebar';
```

**Features:**
- Navigation between different sections
- User profile display
- Collapsible design
- Active state indicators

#### SidebarOption
Individual sidebar navigation item.

**Props:**
```tsx
interface SidebarOptionProps {
  icon: IconDefinition;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}
```

#### Topbar
Top navigation bar component.

**Features:**
- Breadcrumb navigation
- User menu
- Search functionality

### Utility Components

#### DropdownMenu
Context menu component for file/folder operations.

**Props:**
```tsx
interface DropdownMenuProps {
  options: {
    label: string;
    icon: IconDefinition;
    onClick: () => void;
  }[];
}
```

#### DatePicker
Date selection component.

**Props:**
```tsx
interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
}
```

---

## React Hooks

### useFileOperations Hook
Central hook for all file operations including upload, download, share, rename, and delete.

**Import:**
```tsx
import useFileOperations from '@/hooks/useFileOperations';
```

**Returned Functions:**
```tsx
const {
  handleFileChange,
  uploadFile,
  shareFile,
  renameFile,
  deleteFile
} = useFileOperations();
```

#### handleFileChange
Handles file input change events and triggers upload.

**Signature:**
```tsx
handleFileChange: (
  e: ChangeEvent<HTMLInputElement>,
  folderId: string | undefined,
  onUploadSuccess: () => void
) => Promise<void>
```

**Usage:**
```tsx
<input
  type="file"
  onChange={(e) => handleFileChange(e, currentFolderId, refreshFiles)}
/>
```

#### uploadFile
Uploads a file to Supabase storage and creates database record.

**Signature:**
```tsx
uploadFile: (
  file: File,
  folderId: string | undefined,
  onUploadSuccess: () => void
) => Promise<void>
```

**Usage:**
```tsx
await uploadFile(selectedFile, folderId, () => {
  console.log('Upload completed');
  refreshFileList();
});
```

**Validation:**
- Max file size: 20MB
- Max filename length: 60 characters
- Allowed file extensions validation
- Automatic filename sanitization

#### shareFile
Generates a shareable URL for a file with 24-hour expiration.

**Signature:**
```tsx
shareFile: (file: AppFile) => Promise<string | null>
```

**Usage:**
```tsx
const shareUrl = await shareFile(selectedFile);
if (shareUrl) {
  navigator.clipboard.writeText(shareUrl);
}
```

#### renameFile
Renames a file in both Supabase storage and database.

**Signature:**
```tsx
renameFile: (file: AppFile, newItemName: string) => Promise<string | undefined>
```

**Usage:**
```tsx
const result = await renameFile(file, newName);
if (result) {
  showSuccessToast('File renamed successfully');
}
```

#### deleteFile
Deletes a file from both Supabase storage and database.

**Signature:**
```tsx
deleteFile: (file: AppFile) => Promise<string | false>
```

**Usage:**
```tsx
const result = await deleteFile(selectedFile);
if (result) {
  showSuccessToast('File deleted successfully');
  refreshFileList();
}
```

---

## Utility Functions

### Frontend Utilities

#### formatFileSize
Converts bytes to human-readable file size format.

**Import:**
```tsx
import { formatFileSize } from '@/utils/formatFileSize';
```

**Signature:**
```tsx
formatFileSize(bytes: number): string
```

**Usage:**
```tsx
const fileSize = formatFileSize(2048576); // "2.0 MB"
```

**Examples:**
- `1024` → "1.0 KB"
- `1048576` → "1.0 MB"  
- `1073741824` → "1.0 GB"

#### Toast Notifications
Styled notification functions using react-hot-toast.

**Import:**
```tsx
import { showSuccessToast, showErrorToast } from '@/utils/toast';
```

**Functions:**
```tsx
showSuccessToast(message: string): void
showErrorToast(message: string): void
```

**Usage:**
```tsx
showSuccessToast('File uploaded successfully');
showErrorToast('Upload failed');
```

**Styling:**
- Dark theme with white borders
- Custom icons
- Consistent positioning

#### downloadBlob
Downloads a blob as a file with specified filename.

**Import:**
```tsx
import { downloadBlob } from '@/utils/downloadBlob';
```

**Signature:**
```tsx
downloadBlob(blob: Blob, filename: string): void
```

**Usage:**
```tsx
const { data } = await supabase.storage.from('files').download(filePath);
downloadBlob(data, 'document.pdf');
```

#### Authentication Utilities
Helper functions for authentication state management.

**Import:**
```tsx
import { isAuthenticated, getToken, logout } from '@/utils/auth';
```

**Functions:**
```tsx
isAuthenticated(): boolean
getToken(): string | null
logout(): void
```

#### Validation Utilities
Input validation helper functions.

**Import:**
```tsx
import { isDisabled } from '@/utils/disabled';
```

**Functions:**
```tsx
isDisabled(value: string): boolean
```

**Usage:**
```tsx
<Button disabled={isDisabled(fileName)} />
```

### Backend Utilities

#### JWT Token Management
JWT token creation and validation utilities.

**Import:**
```tsx
import { signToken, signRefreshToken, supabaseToken } from '../utils/jwt.js';
```

**Functions:**
```tsx
signToken(payload: object): string        // 15min expiry
signRefreshToken(payload: object): string // 60 days expiry  
supabaseToken(payload: object): string    // 24hr expiry
```

**Usage:**
```tsx
const token = signToken({ id: user.id, email: user.email });
const refreshToken = signRefreshToken({ id: user.id });
```

#### MIME Type Mapping
Maps file MIME types to display categories.

**Import:**
```tsx
import { mapMimeType } from '../utils/mapMimeType.js';
```

**Function:**
```tsx
mapMimeType(mimeType: string): string
```

**Usage:**
```tsx
const fileType = mapMimeType('application/pdf'); // "document"
```

#### Email Service
Sends password recovery emails.

**Import:**
```tsx
import sendEmail from '../utils/sendEmail.js';
```

**Function:**
```tsx
sendEmail(email: string, token: string): Promise<void>
```

#### Token Verification
Verifies and decodes JWT tokens.

**Import:**
```tsx
import { verifyRefreshToken } from '../utils/tokenUtils.js';
```

**Function:**
```tsx
verifyRefreshToken(token: string): any
```

### Middleware

#### Authentication Middleware
Validates JWT tokens for protected routes.

**Import:**
```tsx
import authenticateToken from '../middleware/authMiddleware.js';
```

**Usage:**
```tsx
router.use(authenticateToken);
```

**Functionality:**
- Extracts Bearer token from Authorization header
- Verifies token signature and expiration
- Adds decoded user info to `req.user`
- Returns 401/403 for invalid tokens

---

## API Integration Layer

### Files API
Client-side API functions for file operations.

**Import:**
```tsx
import { createFile } from '@/api/files';
```

#### createFile
Creates a file record in the database after upload.

**Signature:**
```tsx
createFile(
  file: File,
  filename: string,
  userId: string,
  folderId?: string | null
): Promise<AxiosResponse>
```

**Usage:**
```tsx
const response = await createFile(file, sanitizedName, userId, folderId);
```

### Folders API
Client-side API functions for folder operations.

**Import:**
```tsx
import createNewFolder from '@/api/folders';
```

#### createNewFolder
Creates a new folder in the specified parent directory.

**Signature:**
```tsx
createNewFolder(
  userId: string,
  folderName: string
): Promise<AxiosResponse>
```

**Usage:**
```tsx
const response = await createNewFolder(userId, 'New Folder');
```

---

## Types & Interfaces

### File Interface
```tsx
interface AppFile {
  id: string;
  name: string;
  createdAt: string;
  type: string;
  size: number;
  createdBy: string;
  folderId?: string;
  user: {
    email: string;
  };
}
```

### Folder Interface
```tsx
interface AppFolder {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  parentId?: string;
  user: {
    email: string;
  };
}
```

### User Interface
```tsx
interface User {
  id: string;
  email: string;
  fullname?: string;
  country?: string;
  role: string;
  language?: string;
  timezone?: string;
}
```

### API Response Types
```tsx
interface APIResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
}

interface AuthResponse {
  token: string;
  stoken?: string;
  userId?: string;
}
```

---

## Error Handling

### Common HTTP Status Codes
- `200`: Success
- `201`: Created successfully
- `400`: Bad request / Validation error
- `401`: Unauthorized / Invalid credentials
- `403`: Forbidden / Invalid token
- `404`: Resource not found
- `500`: Internal server error

### Error Response Format
```json
{
  "error": "Error message description",
  "message": "User-friendly error message"
}
```

### Client-Side Error Handling
```tsx
try {
  const response = await apiCall();
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error || "Something went wrong";
    showErrorToast(message);
  } else {
    showErrorToast("Unexpected error occurred");
  }
}
```

---

## Environment Variables

### Backend (.env)
```env
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
DATABASE_URL=your_database_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
EMAIL_SERVICE_API_KEY=your_email_service_key
NODE_ENV=development|production
PORT=4000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Security Considerations

### Authentication
- JWT tokens with short expiration (15 minutes)
- Refresh tokens with longer expiration (60 days)
- Secure HTTP-only cookies for refresh tokens
- CORS configuration for allowed origins

### File Security
- File type validation on upload
- File size limits (20MB maximum)
- Filename sanitization
- User-scoped file access (users can only access their own files)

### API Security
- Rate limiting (100 requests per 15 minutes)
- Request validation and sanitization
- SQL injection prevention with Prisma ORM
- XSS protection with input sanitization

---

## Performance Considerations

### Backend
- Database indexing on frequently queried fields
- File storage optimization with Supabase
- Efficient query patterns with Prisma
- Connection pooling for database connections

### Frontend
- Lazy loading of file lists
- Optimistic UI updates
- Debounced search functionality
- Efficient re-rendering with React hooks

### Caching Strategy
- JWT token caching in localStorage
- File metadata caching
- Supabase client connection reuse

---

This documentation covers all public APIs, functions, and components in the File Uploader application. Each section includes detailed usage examples, parameter descriptions, and best practices for integration.