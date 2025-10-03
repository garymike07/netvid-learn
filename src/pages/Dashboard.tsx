import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, BookOpen, Loader2, PlayCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type DashboardMetrics = {
  coursesEnrolled: number;
  videosWatched: number;
  certificatesEarned: number;
  progressPercentage: number;
};

type CourseProgress = {
  id: string;
  title: string;
  level?: string | null;
  progress: number;
  nextLesson?: string | null;
};

const fallbackMetrics: DashboardMetrics = {
  coursesEnrolled: 0,
  videosWatched: 0,
  certificatesEarned: 0,
  progressPercentage: 0,
};

const fallbackCourses: CourseProgress[] = [
  {
    id: "network-fundamentals",
    title: "Network Foundations",
    level: "Beginner",
    progress: 0,
    nextLesson: "Start with 'What is a Network?'",
  },
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>(fallbackMetrics);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>(fallbackCourses);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [{ data: metricsData, error: metricsError }, { data: coursesData, error: coursesError }] = await Promise.all([
          supabase
            .from("learner_metrics")
            .select("courses_enrolled, videos_watched, certificates, progress")
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("enrollments")
            .select("progress, next_lesson, courses ( id, title, level )")
            .eq("user_id", user.id),
        ]);

        if (metricsError) {
          if (metricsError.code !== "42P01") {
            throw metricsError;
          }
        } else if (metricsData) {
          setMetrics({
            coursesEnrolled: metricsData.courses_enrolled ?? 0,
            videosWatched: metricsData.videos_watched ?? 0,
            certificatesEarned: metricsData.certificates ?? 0,
            progressPercentage: metricsData.progress ?? 0,
          });
        }

        if (coursesError) {
          if (coursesError.code !== "42P01") {
            throw coursesError;
          }
        } else if (coursesData && coursesData.length > 0) {
          setCourseProgress(
            coursesData.map((item, index) => ({
              id: item.courses?.id ?? `course-${index}`,
              title: item.courses?.title ?? "Course",
              level: item.courses?.level,
              progress: item.progress ?? 0,
              nextLesson: item.next_lesson,
            })),
          );
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load your data";
        toast.error(message, {
          description: "Showing cached data until the connection is restored.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out";
      toast.error(message);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <Button variant="outline" onClick={handleSignOut} disabled={signingOut} className="gap-2">
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {signingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">My Dashboard</h1>
          <p className="text-lg text-muted-foreground">Track your progress and continue learning</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses Enrolled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{metrics.coursesEnrolled}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Videos Watched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{metrics.videosWatched}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{metrics.certificatesEarned}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{metrics.progressPercentage}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </div>
            <Button asChild variant="default">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Fetching your courses...
              </div>
            ) : (
              <div className="space-y-6">
                {courseProgress.map((course) => (
                  <div key={course.id} className="rounded-lg border border-border p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.level ?? "Self-paced"}
                          {course.nextLesson ? ` • Next: ${course.nextLesson}` : ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        {Math.round(course.progress)}% complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
