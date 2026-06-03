import { Link } from "wouter";
import { Home, BookOpen, Search, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="404 – Page Not Found | AmourScans"
        description="The page you're looking for doesn't exist. Head back to AmourScans and keep reading your favorite manga and manhwa."
        keywords="404, page not found"
      />
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md w-full">
          <div className="mb-8 relative">
            <span className="text-[9rem] font-black text-primary/10 select-none leading-none block">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 shadow-lg">
                <AlertTriangle className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            Page not found
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Looks like this page went missing. The chapter might have moved,
            or maybe the link is broken.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/browse">
                <Search className="w-4 h-4 mr-2" />
                Browse Manga
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/library" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              My Library
            </Link>
            <span className="opacity-30">•</span>
            <Link href="/history" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Reading History
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
