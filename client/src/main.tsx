import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ClerkProvider } from "@clerk/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/Login";
import RegisterPage from "./routes/Register";
import PostListPage from "./routes/PostListPage";
import Write from "./routes/Write";

import "./index.css";
import SinglePostPage from "./routes/SinglePostPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/posts",
        element: <PostListPage />,
      },
       {
        path: "/:slug",
        element: <SinglePostPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
    </QueryClientProvider>
  </StrictMode>,
);
