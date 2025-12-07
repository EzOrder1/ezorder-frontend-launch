import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center py-16">
        <div className="text-center">
          <h1 className="font-heading text-8xl font-bold text-primary">404</h1>
          <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="mt-2 text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/" className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
