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
      {/* Hero Section - Clean & Immersive */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing/hero.png"
            alt="Traditional Alor community assembly under a majestic Oji tree"
            fill
            className="object-cover brightness-[0.35] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-background" />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="animate-fadeIn space-y-6 md:space-y-8">
            <h1 className="font-serif font-bold text-background leading-[1.08] tracking-tight">
              Preserving{" "}
              <span className="text-accent italic font-normal">Our Roots</span>,
              <br className="hidden sm:block" />
              <span className="text-secondary">Building Our Future</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-xl text-background/95 leading-relaxed font-medium">
              The living heart of Alor — a sacred archive for lineage, a vibrant
              hub for dialogue, and a digital home for our global community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-accent text-primary rounded-2xl font-bold text-base uppercase tracking-wide hover:bg-accent/90 transition-all active:scale-95 shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Join The Community</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/archive"
                className="px-8 py-4 bg-background/10 backdrop-blur-md border-2 border-background/30 text-background rounded-2xl font-semibold text-base hover:bg-background/20 transition-all active:scale-95 flex items-center justify-center"
              >
                Explore Archives
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex-col items-center space-y-2 opacity-40">
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-20 md:py-28 bg-primary text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-[380px] md:h-[480px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-accent/10">
              <Image
                src="/images/landing/archive.png"
                alt="Heritage scrolls and digital archive"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-xs uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Our Collective Duty
              </div>
              <h2 className="font-serif font-bold leading-tight">
                The Living Archive of Alor Identity
              </h2>
              <p className="text-base md:text-lg text-background/85 leading-relaxed">
                History is not just in the past; it lives through us. We are
                building a permanent repository for biographies, village
                journals, and cultural wisdom that ensures no voice from Alor is
                ever forgotten.
              </p>
              <ul className="space-y-3">
                {[
                  "Document your family legacy with photos and text",
                  "Preserve historical accounts of Alor's evolution",
                  "Access a curated library of community wisdom",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-3 text-sm md:text-base font-medium"
                  >
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <ChevronRight className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interaction Sections - Clean Grid */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Village Dialogue */}
          <div className="group relative bg-card/40 rounded-[2rem] p-8 md:p-12 border border-border/60 hover:border-secondary/40 transition-all duration-500 overflow-hidden min-h-[420px] md:min-h-[480px] flex flex-col justify-end">
            <div className="absolute top-0 right-0 p-10 opacity-8 group-hover:scale-110 transition-transform duration-700">
              <MessageSquare className="w-40 h-40 text-secondary" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-serif font-bold text-primary">
                Village Dialogue
              </h3>
              <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                Connect with kin from your village and participate in age-grade
                discussions. Whether you're in Alor or the Diaspora, the
                conversation never stops.
              </p>
              <Link
                href="/dialogue"
                className="inline-flex items-center space-x-2 text-secondary font-bold text-sm uppercase tracking-wide hover:translate-x-2 transition-transform"
              >
                <span>Enter The Square</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Osisi Ndu */}
          <div className="group relative bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-border/60 hover:border-accent/40 transition-all duration-500 overflow-hidden min-h-[420px] md:min-h-[480px] flex flex-col justify-end">
            <div className="absolute top-8 right-8 w-52 h-52 opacity-15">
              <Image
                src="/images/landing/tree.png"
                alt="Tree of Life Minimal"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-serif font-bold text-primary">Osisi Ndụ</h3>
              <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                Visualize your lineage through interactive family trees. Map out
                generations and discover deep connections across the Alor
                community.
              </p>
              <Link
                href="/tree"
                className="inline-flex items-center space-x-2 text-accent font-bold text-sm uppercase tracking-wide hover:translate-x-2 transition-transform"
              >
                <span>Trace Your Lineage</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Clean & Simple */}
      <section className="py-20 md:py-28 bg-secondary/5 border-y border-border/40">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-12 md:mb-16 space-y-3">
            <h2 className="font-serif font-bold text-primary">
              How to Use Alorpedia
            </h2>
            <p className="text-sm md:text-base text-foreground/60 font-medium italic">
              Empowering every Alor son and daughter
            </p>
          </div>

          <div className="space-y-5">
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
                className="flex items-start space-x-5 bg-background p-6 md:p-7 rounded-[1.5rem] shadow-sm border border-border/20 active:scale-[0.98] transition-transform"
              >
                <div
                  className={`${step.color} w-12 h-12 md:w-14 md:h-14 rounded-[1rem] flex items-center justify-center shrink-0 shadow-md`}
                >
                  <step.icon className="w-6 h-6 md:w-7 md:h-7 text-background" />
                </div>
                <div className="space-y-1.5 pt-0.5">
                  <h4 className="text-base md:text-lg font-bold text-primary">
                    {step.title}
                  </h4>
                  <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="max-w-4xl mx-auto px-5 relative z-10 text-center">
          <div className="space-y-8 md:space-y-10">
            <Heart className="w-12 h-12 md:w-14 md:h-14 text-secondary mx-auto animate-pulse" />
            <h2 className="font-serif font-bold text-background leading-tight">
              Ready to{" "}
              <span className="text-accent italic font-normal">Connect</span>{" "}
              With Your Roots?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-10 py-4 bg-accent text-primary rounded-[1.75rem] font-bold text-base uppercase tracking-wide hover:scale-105 transition-all shadow-2xl"
              >
                Join Now
              </Link>
              <Link
                href="/directory"
                className="px-10 py-4 border-2 border-background/30 text-background rounded-[1.75rem] font-semibold text-base hover:bg-background/10 transition-all flex items-center justify-center"
              >
                Find Kinfolks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-foreground/40 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] bg-background">
        &copy; 2024 Alorpedia &bull; Preserving Our Shared Heritage
      </footer>
    </div>
  );
}
