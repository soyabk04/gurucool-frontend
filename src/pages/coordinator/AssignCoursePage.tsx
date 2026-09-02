import { useEffect, useState } from "react";

import CourseSelect from "@/components/coordinator/CourseSelect";
import UserTable from "@/components/coordinator/UserTable";
import { Button } from "@/components/ui/button";

import {
  assignCourseToUsers,
  type ChapterSchedule,
} from "@/services/coordinator";

import { getChapters } from "@/services/chapter.services";

interface Chapter {
  _id: string;
  title: string;
}

interface ChapterDateState {
  chapterId: string;
  accessDate: string;
  lastDate: string;
}

export default function AssignCoursePage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterDates, setChapterDates] = useState<
    ChapterDateState[]
  >([]);

  const [loadingChapters, setLoadingChapters] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // Load chapters whenever course changes
  // =========================================================

  useEffect(() => {
    if (!selectedCourse) {
      setChapters([]);
      setChapterDates([]);
      return;
    }

    loadChapters(selectedCourse);
  }, [selectedCourse]);

  const loadChapters = async (courseId: string) => {
    try {
      setLoadingChapters(true);

      const data = await getChapters(courseId);

      const fetchedChapters = data;

      setChapters(fetchedChapters);

      // Create empty date state for every chapter
      setChapterDates(
        fetchedChapters.map((chapter: Chapter) => ({
          chapterId: chapter._id,
          accessDate: "",
          lastDate: "",
        }))
      );
    } catch (error) {
      console.error("Failed to load chapters:", error);

      setChapters([]);
      setChapterDates([]);
    } finally {
      setLoadingChapters(false);
    }
  };

  // =========================================================
  // Update chapter access date
  // =========================================================

  const updateAccessDate = (
    chapterId: string,
    value: string
  ) => {
    setChapterDates((previous) =>
      previous.map((chapter) =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              accessDate: value,
            }
          : chapter
      )
    );
  };

  // =========================================================
  // Update chapter last date
  // =========================================================

  const updateLastDate = (
    chapterId: string,
    value: string
  ) => {
    setChapterDates((previous) =>
      previous.map((chapter) =>
        chapter.chapterId === chapterId
          ? {
              ...chapter,
              lastDate: value,
            }
          : chapter
      )
    );
  };

  // =========================================================
  // Assign course
  // =========================================================

  const handleAssign = async () => {
    // Course validation
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    // User validation
    if (selectedUsers.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    // Chapter validation
    if (chapters.length === 0) {
      alert("This course has no chapters.");
      return;
    }

    // Make sure every chapter has dates
    for (const chapter of chapterDates) {
      if (!chapter.accessDate) {
        const currentChapter = chapters.find(
          (item) => item._id === chapter.chapterId
        );

        alert(
          `Please select an access date for ${
            currentChapter?.title ?? "a chapter"
          }.`
        );

        return;
      }

      if (!chapter.lastDate) {
        const currentChapter = chapters.find(
          (item) => item._id === chapter.chapterId
        );

        alert(
          `Please select a last date for ${
            currentChapter?.title ?? "a chapter"
          }.`
        );

        return;
      }

      // Check date range
      if (chapter.accessDate >= chapter.lastDate) {
        const currentChapter = chapters.find(
          (item) => item._id === chapter.chapterId
        );

        alert(
          `Last date must be after access date for ${
            currentChapter?.title ?? "a chapter"
          }.`
        );

        return;
      }
    }

    try {
      setLoading(true);

      const schedules: ChapterSchedule[] =
        chapterDates.map((chapter) => ({
          chapterId: chapter.chapterId,

          // Convert local date to ISO string
          accessDate: new Date(
            chapter.accessDate
          ).toISOString(),

          lastDate: new Date(
            chapter.lastDate
          ).toISOString(),
        }));

      await assignCourseToUsers(
        selectedCourse,
        selectedUsers,
        schedules
      );

      alert("Course assigned successfully.");

      // Reset users
      setSelectedUsers([]);

      // Reset chapter dates
      setChapterDates(
        chapters.map((chapter) => ({
          chapterId: chapter._id,
          accessDate: "",
          lastDate: "",
        }))
      );
    } catch (error) {
      console.error(error);

      alert("Failed to assign course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          Course
      ====================================================== */}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Select Course
        </h2>

        <CourseSelect
          value={selectedCourse}
          onChange={(value) =>
            setSelectedCourse(value ?? "")
          }
        />
      </div>

      {/* =====================================================
          Chapter Access Schedule
      ====================================================== */}

      {selectedCourse && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Chapter Access Schedule
            </h2>

            <p className="text-sm text-muted-foreground">
              Set the access and last date for each chapter.
            </p>
          </div>

          {loadingChapters ? (
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              Loading chapters...
            </div>
          ) : chapters.length === 0 ? (
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              No chapters found for this course.
            </div>
          ) : (
            <div className="space-y-3">
              {chapters.map((chapter, index) => {
                const dates = chapterDates.find(
                  (item) =>
                    item.chapterId === chapter._id
                );

                return (
                  <div
                    key={chapter._id}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Chapter {index + 1}
                      </p>

                      <h3 className="font-medium">
                        {chapter.title}
                      </h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Access Date */}
                      <div className="space-y-2">
                        <label
                          htmlFor={`access-${chapter._id}`}
                          className="text-sm font-medium"
                        >
                          Access Date
                        </label>

                        <input
                          id={`access-${chapter._id}`}
                          type="date"
                          value={
                            dates?.accessDate ?? ""
                          }
                          onChange={(event) =>
                            updateAccessDate(
                              chapter._id,
                              event.target.value
                            )
                          }
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                      </div>

                      {/* Last Date */}
                      <div className="space-y-2">
                        <label
                          htmlFor={`last-${chapter._id}`}
                          className="text-sm font-medium"
                        >
                          Last Date
                        </label>

                        <input
                          id={`last-${chapter._id}`}
                          type="date"
                          value={
                            dates?.lastDate ?? ""
                          }
                          min={
                            dates?.accessDate || undefined
                          }
                          onChange={(event) =>
                            updateLastDate(
                              chapter._id,
                              event.target.value
                            )
                          }
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          Users
      ====================================================== */}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Select Users
        </h2>

        <UserTable
          selected={selectedUsers}
          onChange={setSelectedUsers}
        />
      </div>

      {/* =====================================================
          Assign Button
      ====================================================== */}

      <Button
        disabled={
          loading ||
          loadingChapters ||
          !selectedCourse ||
          selectedUsers.length === 0 ||
          chapters.length === 0
        }
        onClick={handleAssign}
      >
        {loading
          ? "Assigning..."
          : "Assign Course"}
      </Button>
    </div>
  );
}
