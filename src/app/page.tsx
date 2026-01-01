import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Users,
  MapPin,
  GitBranch,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Heart,
  User,
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background overflow-x-hidden">
      {/* Hero Section - Immersive & Cinematic */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing/hero.png"
            alt="Traditional Alor community assembly under a majestic Oji tree"
            fill
            className="object-cover brightness-[0.4] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-background mb-8 leading-[1.1] tracking-tight">
              Preserving{" "}
              <span className="text-accent italic font-normal">Our Roots</span>,
              <br />
              <span className="text-secondary">Building Our Future</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-2xl text-background/90 mb-12 leading-relaxed font-medium">
              Alorpedia is the living heart of Alor. A sacred archive for
              lineage, a vibrant hub for dialogue, and a digital home for our
              global community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/register"
                className="px-10 py-5 bg-accent text-primary rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-accent/90 transition-all active:scale-95 shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Join The Community</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/archive"
                className="px-10 py-5 bg-background/10 backdrop-blur-md border-2 border-background/20 text-background rounded-2xl font-bold text-lg hover:bg-background/20 transition-all active:scale-95 flex items-center justify-center"
              >
                Explore Archives
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center space-y-2 opacity-50">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
            Scroll to discover
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-32 bg-primary text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-accent/10">
              <Image
                src="/images/landing/archive.png"
                alt="Heritage scrolls and digital archive"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs uppercase tracking-widest leading-none">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Our Collective Duty
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                The Living Archive of Alor Identity
              </h2>
              <p className="text-xl text-background/80 leading-relaxed">
                History is not just in the past; it lives through us. We are
                building a permanent repository for biographies, village
                journals, and cultural wisdom that ensures no voice from Alor is
                ever forgotten.
              </p>
              <ul className="space-y-4">
                {[
                  "Document your family legacy with photos and text",
                  "Preserve historical accounts of Alor's evolution",
                  "Access a curated library of community wisdom",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 text-lg font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interaction Sections - Grid Feel */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Village Dialogue */}
          <div className="group relative bg-card/30 rounded-[2.5rem] p-10 md:p-14 border border-border/50 hover:border-secondary/30 transition-all duration-500 overflow-hidden min-h-[500px] flex flex-col justify-end">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <MessageSquare className="w-48 h-48 text-secondary" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-4xl font-serif font-bold text-primary">
                Village Dialogue
              </h3>
              <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                Connect with kin from your village and participate in age-grade
                discussions. Whether you're in Alor or the Diaspora, the
                conversation never stops.
              </p>
              <Link
                href="/dialogue"
                className="inline-flex items-center space-x-2 text-secondary font-black uppercase tracking-widest hover:translate-x-2 transition-transform"
              >
                <span>Enter The Square</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Osisi Ndu */}
          <div className="group relative bg-primary/5 rounded-[2.5rem] p-10 md:p-14 border border-border/50 hover:border-accent/30 transition-all duration-500 overflow-hidden min-h-[500px] flex flex-col justify-end">
            <div className="absolute top-10 right-10 w-64 h-64 opacity-20">
              <Image
                src="/images/landing/tree.png"
                alt="Tree of Life Minimal"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-4xl font-serif font-bold text-primary">
                Osisi Ndụ
              </h3>
              <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                Visualize your lineage through interactive family trees. Map out
                generations and discover deep connections across the Alor
                community.
              </p>
              <Link
                href="/tree"
                className="inline-flex items-center space-x-2 text-accent font-black uppercase tracking-widest hover:translate-x-2 transition-transform"
              >
                <span>Trace Your Lineage</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Native Mobile UI Focus */}
      <section className="py-32 bg-secondary/5 border-y border-border/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              How to Use Alorpedia
            </h2>
            <p className="text-lg text-foreground/60 font-medium italic">
              Empowering every Alor son and daughter
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "Create Your Identity",
                desc: "Register with your Village and Age-Grade to find your place in our community records.",
                icon: User,
                color: "bg-primary",
              },
              {
                title: "Document Your Story",
                desc: "Post biographies, historical insights, or community updates to the Living Archive.",
                icon: BookOpen,
                color: "bg-secondary",
              },
              {
                title: "Connect & Discern",
                desc: "Join village dialogues and collaborate with professionals in the Brain Trust.",
                icon: MapPin,
                color: "bg-accent",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-start space-x-6 bg-background p-8 rounded-[2rem] shadow-sm border border-border/10 active:scale-[0.98] transition-transform"
              >
                <div
                  className={`${step.color} w-16 h-16 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-lg`}
                >
                  <step.icon className="w-8 h-8 text-background" />
                </div>
                <div className="space-y-2 pt-1">
                  <h4 className="text-xl font-bold text-primary">
                    {step.title}
                  </h4>
                  <p className="text-foreground/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="space-y-12">
            <Heart className="w-16 h-16 text-secondary mx-auto animate-pulse" />
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-background leading-tight">
              Ready to{" "}
              <span className="text-accent italic font-normal">Connect</span>{" "}
              With Your Roots?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <Link
                href="/register"
                className="px-12 py-6 bg-accent text-primary rounded-[2rem] font-black text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                Join Now
              </Link>
              <Link
                href="/directory"
                className="px-12 py-6 border-2 border-background/20 text-background rounded-[2rem] font-bold text-xl hover:bg-background/10 transition-all flex items-center justify-center"
              >
                Find Kinfolks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-foreground/40 text-xs font-bold uppercase tracking-[0.3em] bg-background">
        &copy; 2024 Alorpedia &bull; Preserving Our Shared Heritage
      </footer>
    </div>
  );
}
