
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useTheme } from "@/context/ThemeContext";

import {
  getAdminGroupProgress,
} from "@/services/course.service";

import { getOrganizationCourses } from "@/services/organizationCourse.service";

/* =========================================================
   TYPES
========================================================= */

interface AdminCourse {
  _id: string;

  courseId: {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
  };
}

interface AdminGroupProgress {
  group: {
    _id: string;
    name: string;
    groupCode: string;
    coordinator?: {
      name: string;
    } | null;
  };
  totalLearners: number;
  completedLearners: number;
  inProgressLearners: number;
  notStartedLearners: number;
  averageProgress: number;
  completedChapters: number;
  totalPossibleChapters: number;
  lastActivity: string | null;
}

/* =========================================================
   PAGE
========================================================= */

export default function GroupProgress() {
  const { theme } = useTheme();

  /*
   * Courses available to the admin.
   *
   * This assumes getGroupCourses() currently returns the
   * course assignment structure you already use.
   *
   * If admins have a different course API, only this part
   * needs to be changed.
   */
  const [courses, setCourses] = useState<
    AdminCourse[]
  >([]);

  /*
   * Actual Course._id
   */
  const [selectedCourseId, setSelectedCourseId] =
    useState("");

  /*
   * Group progress for selected course.
   */
  const [groups, setGroups] = useState<
    AdminGroupProgress[]
  >([]);

  const [search, setSearch] = useState("");

  const [coursesLoading, setCoursesLoading] =
    useState(true);

  const [groupsLoading, setGroupsLoading] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  /* =======================================================
     LOAD COURSES
  ======================================================== */

  const loadCourses = useCallback(async () => {
    try {
      setCoursesLoading(true);
      setError(null);

      const data = await getOrganizationCourses();

      console.log("Loaded courses:", data);

      setCourses(data.data ?? []);

      /*
       * Select first course automatically.
       */
      if (data.data?.length > 0) {
        setSelectedCourseId((current) => {
          const stillExists = data.data.some(
            (item: AdminCourse) =>
              item.courseId._id === current
          );

          if (current && stillExists) {
            return current;
          }

          return data.data[0].courseId._id;
        });
      } else {
        setSelectedCourseId("");
        setGroups([]);
      }
    } catch (error: any) {
      console.error(
        "Failed to load courses:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load courses."
      );
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  /* =======================================================
     LOAD GROUP PROGRESS
  ======================================================== */

  const loadGroupProgress = useCallback(async () => {
    if (!selectedCourseId) {
      setGroups([]);
      return;
    }

    try {
      setGroupsLoading(true);
      setError(null);

      const data =
        await getAdminGroupProgress(
          selectedCourseId,
        );

      setGroups(data);
    } catch (error: any) {
      console.error(
        "Failed to load group progress:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load group progress."
      );

      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  }, [selectedCourseId, search]);

  /* =======================================================
     INITIAL COURSE LOAD
  ======================================================== */

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  /* =======================================================
     LOAD GROUP PROGRESS WHEN COURSE / SEARCH CHANGES
  ======================================================== */

  useEffect(() => {
    if (selectedCourseId) {
      loadGroupProgress();
    }
  }, [
    selectedCourseId,
    loadGroupProgress,
  ]);

  /* =======================================================
     SELECTED COURSE
  ======================================================== */

  const selectedCourse = useMemo(() => {
    const selected = courses.find(
      (item) =>
        item.courseId._id ===
        selectedCourseId
    );

    return selected?.courseId;
  }, [courses, selectedCourseId]);

  /* =======================================================
     SUMMARY
  ======================================================== */

  const totalGroups = groups.length;

  const totalLearners = groups.reduce(
    (total, group) =>
      total + group.totalLearners,
    0
  );

  const completedLearners = groups.reduce(
    (total, group) =>
      total + group.completedLearners,
    0
  );

  const inProgressLearners = groups.reduce(
    (total, group) =>
      total + group.inProgressLearners,
    0
  );

  const notStartedLearners = groups.reduce(
    (total, group) =>
      total + group.notStartedLearners,
    0
  );
  notStartedLearners

  /*
   * Weighted average across all learners.
   *
   * This is better than simply averaging the
   * group's averageProgress values because groups
   * can have different numbers of learners.
   */
  const averageProgress =
    totalLearners > 0
      ? Math.round(
          groups.reduce(
            (total, group) =>
              total +
              group.averageProgress *
                group.totalLearners,
            0
          ) / totalLearners
        )
      : 0;

  /* =======================================================
     COURSE CHANGE
  ======================================================== */

  const handleCourseChange = (
    courseId: string
  ) => {
    setSelectedCourseId(courseId);

    /*
     * Clear old course data immediately.
     */
    setGroups([]);

    setSearch("");

    setError(null);
  };

  /* =======================================================
     REFRESH
  ======================================================== */

  const handleRefresh = async () => {
    if (selectedCourseId) {
      await loadGroupProgress();
    } else {
      await loadCourses();
    }
  };

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <div className="w-full space-y-6 p-6">

      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Group Progress
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a course to view group-wise
            learner progress.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={
            coursesLoading ||
            groupsLoading
          }
          className="gap-2"
        >
          <RefreshCw
            className={
              coursesLoading ||
              groupsLoading
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />

          Refresh
        </Button>
      </div>

      {/* ===================================================
          COURSE SELECTOR
      ==================================================== */}

      <div className="rounded-xl border bg-card p-5">
        <div className="max-w-xl">

          <label
            htmlFor="course-select"
            className="mb-2 block text-sm font-medium"
          >
            Select Course
          </label>

          <div className="relative">

            <select
              id="course-select"
              value={selectedCourseId}
              onChange={(event) =>
                handleCourseChange(
                  event.target.value
                )
              }
              disabled={
                coursesLoading ||
                courses.length === 0
              }
              className="h-11 w-full appearance-none rounded-lg border bg-background px-3 pr-10 text-sm outline-none transition focus:ring-2"
            >
              {coursesLoading ? (
                <option value="">
                  Loading courses...
                </option>
              ) : courses.length === 0 ? (
                <option value="">
                  No courses available
                </option>
              ) : (
                <>
                  <option value="">
                    Select a course
                  </option>

                  {courses.map((item) => (
                    <option
                      key={item._id}
                      value={
                        item.courseId._id
                      }
                    >
                      {item.courseId.title}
                    </option>
                  ))}
                </>
              )}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {selectedCourse && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">
                Showing group progress for{" "}
                <span className="font-medium text-foreground">
                  {selectedCourse.title}
                </span>
              </p>
            </div>
          )}

        </div>
      </div>

      {/* ===================================================
          ERROR
      ==================================================== */}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ===================================================
          NO COURSES
      ==================================================== */}

      {!coursesLoading &&
        courses.length === 0 && (
          <EmptyCourses />
        )}

      {/* ===================================================
          NO COURSE SELECTED
      ==================================================== */}

      {!coursesLoading &&
        courses.length > 0 &&
        !selectedCourseId && (
          <SelectCourseMessage />
        )}

      {/* ===================================================
          GROUP PROGRESS
      ==================================================== */}

      {selectedCourseId && (
        <>

          {/* ===============================================
              SUMMARY CARDS
          ================================================ */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            <SummaryCard
              title="Total Groups"
              value={totalGroups}
              icon={
                <Users className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor ??
                "#000000"
              }
              loading={groupsLoading}
            />

            <SummaryCard
              title="Total Learners"
              value={totalLearners}
              icon={
                <Users className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor ??
                "#000000"
              }
              loading={groupsLoading}
            />

            <SummaryCard
              title="Average Progress"
              value={`${averageProgress}%`}
              icon={
                <Clock3 className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor ??
                "#000000"
              }
              loading={groupsLoading}
            />

            <SummaryCard
              title="Completed"
              value={completedLearners}
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor ??
                "#000000"
              }
              loading={groupsLoading}
            />

            <SummaryCard
              title="In Progress"
              value={inProgressLearners}
              icon={
                <Clock3 className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor ??
                "#000000"
              }
              loading={groupsLoading}
            />

          </div>

          {/* ===============================================
              SEARCH
          ================================================ */}

          <div className="rounded-xl border bg-card p-4">

            <div className="relative max-w-md">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search group..."
                className="pl-9"
              />

            </div>

          </div>

          {/* ===============================================
              TABLE
          ================================================ */}

          <div className="overflow-hidden rounded-xl border bg-card">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead>

                  <tr className="border-b bg-muted/30">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Group
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Learners
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Progress
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Chapters
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Last Activity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Completion
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {groupsLoading ? (
                    <GroupLoadingRows />
                  ) : groups.length === 0 ? (
                    <EmptyGroups
                      search={search}
                    />
                  ) : (
                    groups.map((item) => (
                      <GroupProgressRow
                        key={item.group._id}
                        item={item}
                        primaryColor={
                          theme?.primaryColor ??
                          "#000000"
                        }
                      />
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ===============================================
              FOOTER
          ================================================ */}

          {!groupsLoading &&
            groups.length > 0 && (
              <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">

                <span>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {groups.length}
                  </span>{" "}
                  groups
                </span>

                {selectedCourse && (
                  <span>
                    Course:{" "}
                    <span className="font-medium text-foreground">
                      {selectedCourse.title}
                    </span>
                  </span>
                )}

              </div>
            )}

        </>
      )}

    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  primaryColor: string;
  loading?: boolean;
}

function SummaryCard({
  title,
  value,
  icon,
  primaryColor,
  loading = false,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          {loading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-2 text-2xl font-semibold">
              {value}
            </p>
          )}

        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `${primaryColor}15`,
            color: primaryColor,
          }}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   GROUP PROGRESS ROW
========================================================= */

interface GroupProgressRowProps {
  item: AdminGroupProgress;
  primaryColor: string;
}

function GroupProgressRow({
  item,
  primaryColor,
}: GroupProgressRowProps) {
  const percentage = Math.min(
    Math.max(item.averageProgress, 0),
    100
  );

  return (
    <tr className="border-b transition-colors last:border-b-0 hover:bg-muted/20">

      {/* GROUP */}

      <td className="px-6 py-4">

        <div className="flex items-center gap-3">

          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            {getInitials(item.group.name)}
          </div>

          <div className="min-w-0">

            <p className="truncate font-medium">
              {item.group.name}
            </p>

            <p className="truncate text-sm text-muted-foreground">
              {item.group.groupCode}
            </p>

            {item.group.coordinator && (
              <p className="truncate text-xs text-muted-foreground">
                Coordinator:{" "}
                {item.group.coordinator.name}
              </p>
            )}

          </div>

        </div>

      </td>

      {/* LEARNERS */}

      <td className="px-6 py-4">

        <div className="space-y-1">

          <p className="text-sm font-medium">
            {item.totalLearners}
          </p>

          <p className="text-xs text-muted-foreground">
            {item.completedLearners} completed
          </p>

        </div>

      </td>

      {/* PROGRESS */}

      <td className="px-6 py-4">

        <div className="w-[190px]">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm font-medium">
              {percentage}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">

            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor:
                  primaryColor,
              }}
            />

          </div>

        </div>

      </td>

      {/* CHAPTERS */}

      <td className="px-6 py-4">

        <span className="text-sm">

          <span className="font-medium">
            {item.completedChapters}
          </span>

          <span className="text-muted-foreground">
            {" "}
            /{" "}
            {item.totalPossibleChapters}
          </span>

        </span>

      </td>

      {/* LAST ACTIVITY */}

      <td className="px-6 py-4">

        <span className="text-sm text-muted-foreground">
          {formatLastActivity(
            item.lastActivity
          )}
        </span>

      </td>

      {/* COMPLETION */}

      <td className="px-6 py-4">

        <div className="space-y-1">

          <p className="text-sm font-medium">
            {item.completedLearners}
            {" "}
            /{" "}
            {item.totalLearners}
          </p>

          <p className="text-xs text-muted-foreground">
            {item.totalLearners > 0
              ? Math.round(
                  (item.completedLearners /
                    item.totalLearners) *
                    100
                )
              : 0}
            % completed
          </p>

        </div>

      </td>

    </tr>
  );
}

/* =========================================================
   LOADING ROWS
========================================================= */

function GroupLoadingRows() {
  return (
    <>
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <tr
            key={index}
            className="border-b last:border-b-0"
          >

            <td className="px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />

                <div className="space-y-2">

                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />

                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />

                </div>

              </div>

            </td>

            <td className="px-6 py-5">
              <div className="space-y-2">
                <div className="h-4 w-10 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            </td>

            <td className="px-6 py-5">

              <div className="space-y-2">

                <div className="h-4 w-10 animate-pulse rounded bg-muted" />

                <div className="h-2 w-44 animate-pulse rounded bg-muted" />

              </div>

            </td>

            <td className="px-6 py-5">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </td>

            <td className="px-6 py-5">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </td>

            <td className="px-6 py-5">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </td>

          </tr>
        )
      )}
    </>
  );
}

/* =========================================================
   EMPTY COURSES
========================================================= */

function EmptyCourses() {
  return (
    <div className="rounded-xl border bg-card px-6 py-16 text-center">

      <div className="mx-auto flex max-w-sm flex-col items-center">

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>

        <h3 className="font-medium">
          No courses available
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          There are currently no courses
          assigned to your organization.
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   SELECT COURSE MESSAGE
========================================================= */

function SelectCourseMessage() {
  return (
    <div className="rounded-xl border bg-card px-6 py-16 text-center">

      <div className="mx-auto flex max-w-sm flex-col items-center">

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>

        <h3 className="font-medium">
          Select a course
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose a course above to view
          group progress.
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   EMPTY GROUPS
========================================================= */

function EmptyGroups({
  search,
}: {
  search: string;
}) {
  return (
    <tr>

      <td
        colSpan={6}
        className="px-6 py-16 text-center"
      >

        <div className="mx-auto flex max-w-sm flex-col items-center">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">

            {search ? (
              <Search className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Users className="h-5 w-5 text-muted-foreground" />
            )}

          </div>

          <h3 className="font-medium">
            {search
              ? "No groups found"
              : "No groups assigned"}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different group name or code."
              : "There are no groups assigned to this course yet."}
          </p>

        </div>

      </td>

    </tr>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name?: string) {
  if (!name) {
    return "G";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

/* =========================================================
   LAST ACTIVITY
========================================================= */

function formatLastActivity(
  date: string | null
) {
  if (!date) {
    return "No activity";
  }

  const activityDate = new Date(date);

  if (
    Number.isNaN(
      activityDate.getTime()
    )
  ) {
    return "No activity";
  }

  const now = new Date();

  const diffMs =
    now.getTime() -
    activityDate.getTime();

  const diffMinutes = Math.floor(
    diffMs / (1000 * 60)
  );

  const diffHours = Math.floor(
    diffMs / (1000 * 60 * 60)
  );

  const diffDays = Math.floor(
    diffMs / (1000 * 60 * 60 * 24)
  );

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return activityDate.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}
