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
  getCourses,
  getCoordinatorUserProgress,
  type CoordinatorUserProgress,
} from "@/services/course.service";
import { getGroupCourses } from "@/services/groupCourse.service";

/* =========================================================
   TYPES
========================================================= */

interface CoordinatorCourse {
  _id: string;

  groupId: {
    _id: string;
    name: string;
    organization: string;
    groupCode: string;
    coordinator: string;
  };

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

/* =========================================================
   PAGE
========================================================= */

export default function UserProgress() {
  const { theme } = useTheme();

  /*
   * Courses returned by:
   *
   * GET /courses/cour
   *
   * Data shape:
   *
   * {
   *   _id,
   *   groupId: {...},
   *   courseId: {
   *      _id,
   *      title,
   *      ...
   *   }
   * }
   */
  const [courses, setCourses] = useState<
    CoordinatorCourse[]
  >([]);

  /*
   * This contains the actual Course._id
   */
  const [selectedCourseId, setSelectedCourseId] =
    useState("");

  /*
   * Learner progress for the selected course.
   */
  const [progress, setProgress] = useState<
    CoordinatorUserProgress[]
  >([]);

  const [search, setSearch] = useState("");

  const [coursesLoading, setCoursesLoading] =
    useState(true);

  const [progressLoading, setProgressLoading] =
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

      const data = await getGroupCourses();
      console.log("Loaded courses:", data);

      /*
       * Your API response is:
       *
       * {
       *   success: true,
       *   data: [...]
       * }
       *
       * getCourses() should return data.data.
       */
      setCourses(data.data ?? []);

      /*
       * Select first course automatically.
       *
       * IMPORTANT:
       * The course ID is item.courseId._id
       */
      if (data.length > 0) {
        setSelectedCourseId((current) => {
          const stillExists = data.some(
            (item: CoordinatorCourse) =>
              item.courseId._id === current
          );

          if (current && stillExists) {
            return current;
          }

          return data[0].courseId._id;
        });
      } else {
        setSelectedCourseId("");
        setProgress([]);
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
     LOAD PROGRESS
  ======================================================== */

  const loadProgress = useCallback(async () => {
    if (!selectedCourseId) {
      setProgress([]);
      return;
    }

    try {
      setProgressLoading(true);
      setError(null);

      /*
       * selectedCourseId is:
       *
       * item.courseId._id
       */
      const data =
        await getCoordinatorUserProgress(
          selectedCourseId
        );

      setProgress(data);
    } catch (error: any) {
      console.error(
        "Failed to load progress:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load learner progress."
      );

      setProgress([]);
    } finally {
      setProgressLoading(false);
    }
  }, [selectedCourseId]);

  /* =======================================================
     INITIAL COURSE LOAD
  ======================================================== */

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  /* =======================================================
     LOAD PROGRESS WHEN COURSE CHANGES
  ======================================================== */

  useEffect(() => {
    if (selectedCourseId) {
      loadProgress();
    }
  }, [selectedCourseId, loadProgress]);

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
     SEARCH
  ======================================================== */

  const filteredProgress = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return progress;
    }

    return progress.filter((item) => {
      const name =
        item.user.name
          ?.toLowerCase() || "";

      const email =
        item.user.email
          ?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        email.includes(searchValue)
      );
    });
  }, [progress, search]);

  /* =======================================================
     SUMMARY
  ======================================================== */

  const totalLearners = progress.length;

  const averageProgress =
    totalLearners > 0
      ? Math.round(
          progress.reduce(
            (total, item) =>
              total + item.progress,
            0
          ) / totalLearners
        )
      : 0;

  const completedLearners =
    progress.filter(
      (item) =>
        item.status === "completed"
    ).length;

  const inProgressLearners =
    progress.filter(
      (item) =>
        item.status === "in-progress"
    ).length;

  const notStartedLearners =
    progress.filter(
      (item) =>
        item.status === "not-started"
    ).length;

  /* =======================================================
     COURSE CHANGE
  ======================================================== */

  const handleCourseChange = (
    courseId: string
  ) => {
    setSelectedCourseId(courseId);

    /*
     * Clear old course's data immediately so
     * it doesn't remain visible while new data
     * is loading.
     */
    setProgress([]);

    setSearch("");

    setError(null);
  };

  /* =======================================================
     REFRESH
  ======================================================== */

  const handleRefresh = async () => {
    if (selectedCourseId) {
      await loadProgress();
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
            User Progress
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a course to view learner
            progress.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={
            coursesLoading ||
            progressLoading
          }
          className="gap-2"
        >
          <RefreshCw
            className={
              coursesLoading ||
              progressLoading
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
                Showing progress for{" "}
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
          PROGRESS CONTENT
      ==================================================== */}

      {selectedCourseId && (
        <>
          {/* ===============================================
              SUMMARY CARDS
          ================================================ */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <SummaryCard
              title="Total Learners"
              value={totalLearners}
              icon={
                <Users className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor??"#00000"
              }
              loading={progressLoading}
            />

            <SummaryCard
              title="Average Progress"
              value={`${averageProgress}%`}
              icon={
                <Clock3 className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor??"#00000"
              }
              loading={progressLoading}
            />

            <SummaryCard
              title="Completed"
              value={completedLearners}
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor??"#00000"
              }
              loading={progressLoading}
            />

            <SummaryCard
              title="In Progress"
              value={inProgressLearners}
              icon={
                <Clock3 className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor??'#00000'
              }
              loading={progressLoading}
            />

            <SummaryCard
              title="Not Started"
              value={notStartedLearners}
              icon={
                <Users className="h-5 w-5" />
              }
              primaryColor={
                theme?.primaryColor??"#00000"
              }
              loading={progressLoading}
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
                placeholder="Search learner..."
                className="pl-9"
              />
            </div>
          </div>

          {/* ===============================================
              TABLE
          ================================================ */}

          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      User
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
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {progressLoading ? (
                    <LoadingRows />
                  ) : filteredProgress.length ===
                    0 ? (
                    <EmptyProgress
                      search={search}
                    />
                  ) : (
                    filteredProgress.map(
                      (item) => (
                        <ProgressRow
                          key={
                            item.user._id
                          }
                          item={item}
                          primaryColor={
                            theme?.primaryColor ?? "#00000"
                          }
                        />
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===============================================
              FOOTER
          ================================================ */}

          {!progressLoading &&
            progress.length > 0 && (
              <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                <span>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredProgress.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {progress.length}
                  </span>{" "}
                  learners
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
   PROGRESS ROW
========================================================= */

interface ProgressRowProps {
  item: CoordinatorUserProgress;
  primaryColor: string;
}

function ProgressRow({
  item,
  primaryColor,
}: ProgressRowProps) {
  const percentage = Math.min(
    Math.max(item.progress, 0),
    100
  );

  return (
    <tr className="border-b transition-colors last:border-b-0 hover:bg-muted/20">
      {/* USER */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            {getInitials(item.user.name)}
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium">
              {item.user.name}
            </p>

            <p className="truncate text-sm text-muted-foreground">
              {item.user.email}
            </p>
          </div>
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
            / {item.totalChapters}
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

      {/* STATUS */}
      <td className="px-6 py-4">
        <StatusBadge
          status={item.status}
        />
      </td>
    </tr>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status:
    | "completed"
    | "in-progress"
    | "not-started";
}) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Completed
      </span>
    );
  }

  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
        <Clock3 className="h-3.5 w-3.5" />
        In Progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      Not Started
    </span>
  );
}

/* =========================================================
   LOADING ROWS
========================================================= */

function LoadingRows() {
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

                  <div className="h-3 w-44 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </td>

            <td className="px-6 py-5">
              <div className="space-y-2">
                <div className="h-4 w-10 animate-pulse rounded bg-muted" />

                <div className="h-2 w-44 animate-pulse rounded bg-muted" />
              </div>
            </td>

            <td className="px-6 py-5">
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </td>

            <td className="px-6 py-5">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </td>

            <td className="px-6 py-5">
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
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
          There are currently no courses assigned
          to your group.
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
          Choose a course above to view learner
          progress.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY PROGRESS
========================================================= */

function EmptyProgress({
  search,
}: {
  search: string;
}) {
  return (
    <tr>
      <td
        colSpan={5}
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
              ? "No learners found"
              : "No learners enrolled"}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different name or email."
              : "There are no learners enrolled in this course for your group yet."}
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
    return "U";
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