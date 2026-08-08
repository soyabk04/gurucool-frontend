import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/AppLayout";
import LoggedInRoute from "@/components/LoggedInRoutes";
import ProtectedRoute from "@/components/ProtectedRoute";

import LoginPage from "@/pages/Login";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ChangePasswordPage from "@/pages/changePassPage";

import Dashboard from "@/pages/Dashboard";
import OrganizationPage from "@/pages/OrganizationPage";
import OrganizationDetailsPage from "@/pages/OrganizationDetailsPage";
import GroupPage from "@/pages/GroupPage";
import UserPage from "@/pages/UserPage";
import CreateUserPage from "@/pages/CreateUserPage";

import Courses from "@/pages/courses/Courses";
import CreateCourse from "@/pages/courses/CreateCourse";
import CourseDetails from "@/pages/courses/CourseDetails";
import CourseEditor from "@/pages/courses/CourseEditor";

import AssignOrganizationCourse from "@/pages/superadmin/AssignOrganizationCourse";
import AssignGroupCourse from "@/pages/admin/AssignOrganizationCourse";
import AssignCoursePage from "@/pages/coordinator/AssignCoursePage";
import OrganizationSettingsPage from "@/pages/OrganizationSettingsPage";
import ChapterPage from "@/pages/ChapterPage";
import ChangemyPasswordPage from "@/pages/changeMyPassword"
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ===================== */}
      {/* Public Routes */}
      {/* ===================== */}
      <Route
        path="/login"
        element={
          <LoggedInRoute>
            <LoginPage />
          </LoggedInRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <LoggedInRoute>
            <ForgotPasswordPage />
          </LoggedInRoute>}
      />
      <Route
        path="/change-password"
        element={
          <LoggedInRoute>
            <ChangePasswordPage />
          </LoggedInRoute>}
      />
      {/* Uncomment after creating the page */}
      {/*
      <Route
        path="/user/reset-password"
        element={<ResetPasswordPage />}
      />
      */}

      {/* ===================== */}
      {/* Protected Routes */}
      {/* ===================== */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
  path="/change-mypassword"
  element={<ChangemyPasswordPage/>}
/>
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orgsetting" element={<OrganizationSettingsPage />} />
        <Route
          path="/courses/assign-course"
          element={
            <ProtectedRoute roles={["admin", "coordinator"]}>
              <AssignCoursePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organization"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <OrganizationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organization/:id"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <OrganizationDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/group"
          element={
            <ProtectedRoute roles={["admin", "coordinator"]}>
              <GroupPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute
              roles={["superadmin", "admin", "coordinator"]}
            >
              <UserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/create"
          element={
            <ProtectedRoute
              roles={["superadmin", "admin", "coordinator"]}
            >
              <CreateUserPage />
            </ProtectedRoute>
          }
        />

        <Route path="/courses" element={<Courses />} />

        <Route
          path="/courses/new"
          element={
            <ProtectedRoute roles={["superadmin", "admin"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:courseId"
          element={<CourseDetails />}
        />

        <Route
          path="/courses/:courseId/edit"
          element={
            <ProtectedRoute roles={["superadmin", "admin"]}>
              <CourseEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/assignOrg"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <AssignOrganizationCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/assigngrp"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AssignGroupCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:courseId/chapter/:chapterId"
          element={<ChapterPage />}
        />
      </Route>

      {/* ===================== */}
      {/* 404 */}
      {/* ===================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}