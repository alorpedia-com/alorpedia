import Link from "next/link";
import { BookOpen, Users, MapPin, GitBranch } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary tracking-tight mb-6">
              Preserving Our Roots, <br />
              <span className="text-secondary">Building Our Future</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 mb-10 leading-relaxed">
              Welcome to Alorpedia—the living archive and community hub for the
              Alor people. Document your lineage, share your wisdom, and connect
              with your age grade.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary text-background rounded-lg font-bold text-lg hover:bg-primary/90 transition-shadow shadow-lg"
              >
                Join the Community
              </Link>
              <Link
                href="/archive"
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-primary/5 transition-colors"
              >
                Explore Archives
              </Link>
            </div>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl -z-0" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="group flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">
                Living Archive
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                A repository of biographies, historical articles, and community
                journals.
              </p>
            </div>

            <div className="group flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-background transition-colors duration-300">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">
                Village Dialogue
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Connect with your village and participate in age-grade
                discussions.
              </p>
            </div>

            <div className="group flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Brain Trust</h3>
              <p className="text-foreground/70 leading-relaxed">
                A searchable directory of professionals and community leaders.
              </p>
            </div>

            <div className="group flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                <GitBranch className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Osisi Ndụ</h3>
              <p className="text-foreground/70 leading-relaxed">
                Interactive family trees to visualize and preserve your lineage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
