import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
      <p className="text-muted-foreground">
        Use the sidebar to manage {user?.role === "user" ? "your courses" : "your organization"}.
      </p>
    </div>
  );
};

export default Dashboard;
