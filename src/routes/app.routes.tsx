import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoggedInRoute } from "@/components/LoggedInRoutes";
import OrganizationPage from "@/pages/OrganizationPage"
import GroupPage from "@/pages/GroupPage";
import UserPage from "@/pages/UserPage";
import CreateUserPage from "@/pages/CreateUserPage";

export default function AppRoutes() {
  return (
    <Routes>
       
      <Route 
      path="/login" 
      element=
      {
      <LoggedInRoute>
        <Login />
      </LoggedInRoute>
      } />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
            <Route
        path="/organization"
        element={
          <ProtectedRoute>
            < OrganizationPage/>
          </ProtectedRoute>
        }
      />
                  <Route
        path="/Group"
        element={
          <ProtectedRoute>
            < GroupPage/>
          </ProtectedRoute>
        }
      />
        <Route
        path="/users"
        element={
          <ProtectedRoute>
            < UserPage/>
          </ProtectedRoute>
        }
      />
              <Route
        path="/users/create"
        element={
          <ProtectedRoute>
            < CreateUserPage/>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}