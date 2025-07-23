"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProjectService } from "@/lib/project-service";
import { DatabaseService } from "@/lib/database";
import type { Project } from "@/lib/types/project";
import type { SpeakerWishlistWithSpeaker } from "@/lib/types/project";
import type { SpeakerWithTestimonials } from "@/lib/database";
import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function ProjectSpeakersPage() {
  const params = useParams();
  const { user } = useAuth();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [wishlist, setWishlist] = useState<SpeakerWishlistWithSpeaker[]>([]);
  const [allSpeakers, setAllSpeakers] = useState<SpeakerWithTestimonials[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && projectId) {
      loadProjectData();
    }
  }, [user, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProjectData = async () => {
    setLoading(true);
    
    const [projectData, wishlistData, speakersData] = await Promise.all([
      ProjectService.getProjectById(projectId),
      ProjectService.getProjectWishlist(projectId),
      DatabaseService.getAllSpeakers()
    ]);
    
    setProject(projectData);
    setWishlist(wishlistData);
    setAllSpeakers(speakersData);
    setLoading(false);
  };

  const addSpeakerToWishlist = async (speakerId: string) => {
    const result = await ProjectService.addSpeakerToWishlist({
      project_id: projectId,
      speaker_id: speakerId,
      status: "interested",
      priority: "medium"
    });

    if (result) {
      loadProjectData();
      setShowAddModal(false);
    } else {
      alert("Error adding speaker to wishlist");
    }
  };

  const updateWishlistItem = async (wishlistId: string, status: string, notes?: string) => {
    const result = await ProjectService.updateWishlistItem(wishlistId, {
      status: status as 'interested' | 'contacted' | 'proposed' | 'confirmed' | 'declined',
      notes: notes || undefined
    });

    if (result) {
      loadProjectData();
    }
  };

  const removeSpeakerFromWishlist = async (wishlistId: string) => {
    if (confirm("Remove this speaker from your wishlist?")) {
      const result = await ProjectService.removeSpeakerFromWishlist(wishlistId);
      if (result) {
        loadProjectData();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interested': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'proposed': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSpeakers = allSpeakers.filter(speaker => 
    speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !wishlist.some(w => w.speaker_id === speaker.id)
  );

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
            <nav className="text-sm text-gray-600 mb-4">
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              {" / "}
              <Link href="/projects" className="hover:underline">Projects</Link>
              {" / "}
              <Link href={`/projects/${projectId}`} className="hover:underline">
                {project?.name}
              </Link>
              {" / Speakers"}
            </nav>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Speaker Wishlist
                </h1>
                <p className="text-lg text-gray-600">
                  Manage speakers for {project?.name}
                </p>
              </div>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Speaker
              </Button>
            </div>
          </div>

          {/* Wishlist */}
          <div className="space-y-4 mb-8">
            {wishlist.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No speakers in wishlist yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start building your speaker wishlist for this project.
                  </p>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add First Speaker
                  </Button>
                </CardContent>
              </Card>
            ) : (
              wishlist.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-16 w-16">
                          <AvatarImage 
                            src={item.speaker.profile_image || "/api/placeholder/100/100"} 
                            alt={item.speaker.name} 
                          />
                          <AvatarFallback>
                            {item.speaker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold">{item.speaker.name}</h3>
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority} priority
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{item.speaker.title}</p>
                          <p className="text-sm text-gray-500 mb-3">{item.speaker.bio}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.speaker.expertise.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{item.speaker.location}</span>
                            <span className="font-semibold text-blue-600">
                              ${item.speaker.fee.toLocaleString()}+
                            </span>
                          </div>
                          
                          {item.notes && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                              <strong>Notes:</strong> {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Select
                          value={item.status}
                          onValueChange={(value) => updateWishlistItem(item.id, value, item.notes || undefined)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="interested">Interested</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="proposed">Proposed</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Link href={`/speakers/${item.speaker_id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeSpeakerFromWishlist(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Add Speaker Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto m-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Add Speaker to Wishlist</CardTitle>
                      <CardDescription>
                        Select speakers to add to your project wishlist
                      </CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowAddModal(false)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input
                      placeholder="Search speakers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {filteredSpeakers.slice(0, 10).map((speaker) => (
                      <div key={speaker.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage 
                              src={speaker.profile_image || "/api/placeholder/100/100"} 
                              alt={speaker.name} 
                            />
                            <AvatarFallback>
                              {speaker.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{speaker.name}</h4>
                            <p className="text-sm text-gray-600">{speaker.title}</p>
                            <p className="text-sm font-semibold text-blue-600">
                              ${speaker.fee.toLocaleString()}+
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => addSpeakerToWishlist(speaker.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Add to Wishlist
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}