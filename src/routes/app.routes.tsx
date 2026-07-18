import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoggedInRoute } from "@/components/LoggedInRoutes";
import AppLayout from "@/components/AppLayout";
import OrganizationPage from "@/pages/OrganizationPage";
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
import ChapterPage from "@/pages/ChapterPage"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/login"
        element={
          <LoggedInRoute>
            <Login />
          </LoggedInRoute>
        }
      />

      {/* Every route below shares the sidebar/header shell and requires auth. */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
              <Route
        path="/courses/assign-course"
        element={
          <ProtectedRoute roles={["admin",'coordinator']}>
            <AssignCoursePage />
          </ProtectedRoute>}
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
            <ProtectedRoute roles={["superadmin", "admin", "coordinator"]}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute roles={["superadmin", "admin", "coordinator"]}>
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
          path="/courses/:courseId/edit"
          element={
            <ProtectedRoute roles={["superadmin", "admin"]}>
              <CourseEditor />
            </ProtectedRoute>
          }
        />
        <Route path="/courses/:courseId" element={<CourseDetails />} />

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


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
