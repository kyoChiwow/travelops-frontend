import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

interface Hero12Props {
  className?: string;
}

export default function HeroSection({ className }: Hero12Props) {
  return (
    <section className={cn("relative overflow-hidden py-32 min-h-screen", className)}>
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="[radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
        />
      </div>
      <div className="relative z-10 container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <Logo />
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Explore the beauty of{" "}
                <span className="text-primary">Bangaldesh</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                Discover unforgettable journeys tailored to your travel style. From breathtaking destinations to carefully curated experiences, explore tours designed to make every moment count. Plan smarter, travel better, and create memories that last a lifetime.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild className="group">
                <Link to={"/tours"}>Explore</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
