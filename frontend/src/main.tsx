import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { StrictMode } from 'react'
import { PostHogProvider } from 'posthog-js/react'
import router from "./routes/routes.tsx"
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        debug: import.meta.env.MODE === 'development',
      }}
    >
      <RouterProvider router={router} />
    </PostHogProvider>
  </StrictMode>,
)
