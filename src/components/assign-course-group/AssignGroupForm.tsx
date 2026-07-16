import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { getGroups } from "@/services/group.service";
import { getOrgCourses } from "@/services/course.service";
import { assignCourseToGroup } from "@/services/groupCourse.service";

interface Group {
    _id: string;
    name: string;
}

interface Course {
    _id: string;
    title: string;
}

export default function AssignGroupForm() {
    const [groups, setgroups] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);

    const [groupId, setGroupId] = useState("");
    const [courseId, setCourseId] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const [,courseRes] = await Promise.all([
            //     ,
            //     getOrgCourses(),
            // ]);
            const orgRes=await getGroups();
            const courseRes=await getOrgCourses()
            console.log("cout",courseRes)
            setgroups(orgRes.res);
            setCourses(courseRes.res);
        } catch (err) {
            toast.error("Failed to load data");
        }
    };
    const handleAssign = async () => {
        if (!groupId || !courseId) {
            toast.error("Please select organization and course");
            return;
        }

        try {
            setLoading(true);

            await assignCourseToGroup({
                groupId,
                courseId,
            });

            toast.success("Course assigned successfully");

            setGroupId("");
            setCourseId("");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Assignment failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Assign Course to Group</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Group</Label>

                    <Select
                        value={groupId}
                        onValueChange={(value) => {
                            if (value) {
                                setGroupId(value);
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                        </SelectTrigger>

                        <SelectContent>
                            {groups.map((grp:any) => (
                                <SelectItem key={grp._id} value={grp._id}>
                                    {grp.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Course</Label>

                    <Select
                        value={courseId}
                        onValueChange={(value) => {
                            if (value) { setCourseId(value) }
                        }}
                    >

                        <SelectTrigger>
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>

                        <SelectContent>
                            {courses.map((course) => (
                                
                                <SelectItem key={course._id} value={course._id}>
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className="w-full"
                    onClick={handleAssign}
                    disabled={loading}
                >
                    {loading ? "Assigning..." : "Assign Course"}
                </Button>
            </CardContent>
        </Card>
    );
}