import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Award, Download, CheckCircle } from "lucide-react";
import { useParams } from "wouter";
import { format } from "date-fns";

export default function Certificate() {
  const { pathId } = useParams<{ pathId: string }>();
  const pathIdNum = parseInt(pathId || "0");

  const { data: certificate, isLoading } = trpc.certificates.getByPath.useQuery(
    { pathId: pathIdNum },
    { enabled: pathIdNum > 0 }
  );

  const { data: path } = trpc.learningPaths.list.useQuery();
  const currentPath = path?.find(p => p.id === pathIdNum);

  const handleDownload = () => {
    // Create a printable version
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12">
          <p>Loading certificate...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12 text-center">
          <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">No Certificate Yet</h1>
          <p className="text-muted-foreground mb-6">
            Complete all modules in this learning path to earn your certificate.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Certificate Card */}
          <Card className="border-2 border-primary/20 shadow-2xl print:shadow-none">
            <CardContent className="p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <Award className="w-20 h-20 mx-auto mb-4 text-primary" />
                <h1 className="text-4xl font-bold mb-2">Certificate of Completion</h1>
                <p className="text-muted-foreground">AI Learning Curve</p>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-primary/20 my-8" />

              {/* Content */}
              <div className="text-center space-y-6">
                <p className="text-lg">This is to certify that</p>
                
                <p className="text-3xl font-bold text-primary">
                  {certificate.userId}
                </p>

                <p className="text-lg">has successfully completed the</p>

                <p className="text-2xl font-semibold">
                  {currentPath?.title || "Learning Path"}
                </p>

                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>All modules completed</span>
                </div>

                <p className="text-sm text-muted-foreground pt-4">
                  Issued on {format(new Date(certificate.issuedAt), "MMMM dd, yyyy")}
                </p>

                <p className="text-xs text-muted-foreground font-mono">
                  Certificate ID: {certificate.certificateNumber}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-primary/20 my-8" />

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground">
                <p>This certificate verifies the completion of all course requirements</p>
                <p className="mt-2">and demonstrates proficiency in the subject matter.</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8 print:hidden">
            <Button onClick={handleDownload} size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Print styles */}
      <style>{`
        @media print {
          nav, footer, button {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
