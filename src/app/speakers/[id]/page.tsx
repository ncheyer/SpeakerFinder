import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { notFound } from "next/navigation";

const mockSpeaker = {
  id: "1",
  name: "Dr. Sarah Chen",
  title: "Technology Futurist & Innovation Expert",
  bio: "Dr. Sarah Chen is a leading expert in emerging technologies with over 15 years of experience in digital transformation. She has helped Fortune 500 companies navigate the complex landscape of technological change and has been featured as a keynote speaker at major tech conferences worldwide.",
  expertise: ["Technology", "Innovation", "Digital Transformation", "AI", "Future of Work"],
  speakingTopics: [
    "The Future of Artificial Intelligence",
    "Digital Transformation Strategies",
    "Innovation in the Post-Pandemic World",
    "Building Tech-Savvy Organizations",
    "Ethical Technology Implementation"
  ],
  fee: 15000,
  location: "San Francisco, CA",
  availability: ["2024-03-15", "2024-04-10", "2024-05-20"],
  profileImage: "/api/placeholder/200/200",
  videoUrl: "https://example.com/video1",
  testimonials: [
    {
      id: "1",
      clientName: "John Smith",
      clientCompany: "TechCorp",
      content: "Dr. Chen delivered an outstanding keynote that perfectly captured our vision for digital transformation. Our audience was completely engaged.",
      rating: 5,
      eventType: "Corporate Conference"
    },
    {
      id: "2", 
      clientName: "Maria Garcia",
      clientCompany: "Innovation Summit",
      content: "Exceptional speaker with deep knowledge and the ability to make complex topics accessible to everyone.",
      rating: 5,
      eventType: "Industry Summit"
    }
  ],
  yearsExperience: 15,
  languages: ["English", "Mandarin"]
};

export default async function SpeakerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "1") {
    notFound();
  }

  const speaker = mockSpeaker;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={speaker.profileImage} alt={speaker.name} />
                    <AvatarFallback className="text-xl">
                      {speaker.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{speaker.name}</CardTitle>
                    <CardDescription className="text-lg mb-4">{speaker.title}</CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📍 {speaker.location}</span>
                      <span>💼 {speaker.yearsExperience} years experience</span>
                      <span>💰 ${speaker.fee.toLocaleString()}+ speaking fee</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{speaker.bio}</p>
              </CardContent>
            </Card>

            {speaker.videoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Speaker Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <span className="text-gray-500">Video Player Placeholder</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Speaking Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {speaker.speakingTopics.map((topic, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Testimonials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {speaker.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-l-4 border-blue-600 pl-4">
                    <p className="text-gray-700 mb-2">&ldquo;{testimonial.content}&rdquo;</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">{testimonial.clientName}</span>
                      <span>, {testimonial.clientCompany}</span>
                      <span className="ml-2">⭐ {testimonial.rating}/5</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book This Speaker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    ${speaker.fee.toLocaleString()}+
                  </p>
                  <p className="text-sm text-gray-600">Speaking fee</p>
                </div>
                
                <Link href="/qualification" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Request Booking
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full">
                  Contact Speaker
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {speaker.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {speaker.languages.map((language) => (
                    <div key={language} className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      {language}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
