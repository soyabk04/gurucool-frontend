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

import { getOrg } from "@/services/organization.service";
import { getCourses } from "@/services/course.service";
import { assignCourseToOrganization } from "@/services/organizationCourse.service";

interface Organization {
    _id: string;
    name: string;
}

interface Course {
    _id: string;
    name: string;
}

export default function AssignOrganizationForm() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    const [organizationId, setOrganizationId] = useState("");
    const [courseId, setCourseId] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [orgRes,courseRes] = await Promise.all([
                getOrg(),
                getCourses(),
            ]);
           
            setOrganizations(orgRes.res);
            setCourses(courseRes.res);
        } catch (err) {
            toast.error("Failed to load data");
        }
    };

    const handleAssign = async () => {
        if (!organizationId || !courseId) {
            toast.error("Please select organization and course");
            return;
        }

        try {
            setLoading(true);

            await assignCourseToOrganization({
                organizationId,
                courseId,
            });

            toast.success("Course assigned successfully");

            setOrganizationId("");
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
                <CardTitle>Assign Course to Organization</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Organization</Label>

                    <Select
                        value={organizationId}
                        onValueChange={(value) => {
                            if (value) {
                                setOrganizationId(value);
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Organization" />
                        </SelectTrigger>

                        <SelectContent>
                            {organizations.map((org) => (
                                <SelectItem key={org._id} value={org._id}>
                                    {org.name}
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
                                    {course.name}
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