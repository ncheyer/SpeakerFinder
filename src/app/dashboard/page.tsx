"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProjectService } from "@/lib/project-service";
import type { Project } from "@/lib/types/project";
import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<{
    projects: { total: number; planning: number; active: number; completed: number; cancelled: number };
    speakers: { total: number; interested: number; contacted: number; proposed: number; confirmed: number; declined: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const [projectsData, statsData] = await Promise.all([
      ProjectService.getUserProjects(user.id),
      ProjectService.getProjectStats(user.id)
    ]);
    
    setProjects(projectsData);
    setStats(statsData);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Your central hub for managing speaker events and building speaker wishlists
            </p>
            <div className="flex gap-4">
              <Link href="/projects/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create New Project
                </Button>
              </Link>
              <Link href="/speakers">
                <Button variant="outline">
                  Browse Speakers
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.projects.total}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.projects.active}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Speakers in Wishlists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.speakers.total}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Confirmed Speakers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.speakers.confirmed}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Projects */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
                <p className="text-gray-600">Create projects for events, then build speaker wishlists for each one</p>
              </div>
              <Link href="/projects/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create New Project
                </Button>
              </Link>
            </div>

            {projects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to start planning your event?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first project to organize your event and build a wishlist of speakers.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                        Create Project
                      </span>
                      <span>→</span>
                      <span className="flex items-center gap-1">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                        Browse Speakers
                      </span>
                      <span>→</span>
                      <span className="flex items-center gap-1">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                        Build Wishlist
                      </span>
                    </div>
                    <Link href="/projects/new">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Create Your First Project
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {projects.slice(0, 4).map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          {project.description && (
                            <CardDescription className="mt-1">
                              {project.description}
                            </CardDescription>
                          )}
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600">
                        {project.event_date && (
                          <p><strong>Date:</strong> {new Date(project.event_date).toLocaleDateString()}</p>
                        )}
                        {project.location && (
                          <p><strong>Location:</strong> {project.location}</p>
                        )}
                        {project.budget && (
                          <p><strong>Budget:</strong> ${project.budget.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/projects/${project.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Project
                          </Button>
                        </Link>
                        <Link href={`/projects/${project.id}/speakers`}>
                          <Button variant="ghost" size="sm">
                            Wishlist
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {projects.length > 4 && (
              <div className="text-center mt-6">
                <Link href="/projects">
                  <Button variant="outline">View All Projects</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">Create Project</CardTitle>
                <CardDescription>
                  Start planning your next speaking event and organize everything in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/projects/new">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Create New Project
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle className="text-lg text-purple-800">Build Speaker Wishlists</CardTitle>
                <CardDescription>
                  Browse speakers and add them to your project wishlists for easy management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/speakers">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Browse Speakers
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
