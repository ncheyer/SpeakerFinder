import QualificationForm from "@/components/forms/QualificationForm";

export default function QualificationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Speaker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete this qualification form to help us match you with the ideal keynote speaker for your event. 
            All our speakers meet a minimum fee requirement of $10,000.
          </p>
        </div>
        
        <QualificationForm />
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Have questions? Contact us at{" "}
            <a href="mailto:hello@speakerfinder.com" className="text-blue-600 hover:underline">
              hello@speakerfinder.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}