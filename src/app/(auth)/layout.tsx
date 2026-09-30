import Image from "next/image";
import Link from "next/link";
import { AuthCarousel } from "@/components/auth/auth-carousel";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2 bg-card text-ink">
      {/* Left Column: Full-height Visual Carousel (Desktop & Tablet) */}
      <div className="relative hidden lg:block h-full w-full overflow-hidden bg-ink-dark">
        <AuthCarousel />
      </div>

      {/* Right Column: Centered Auth Form Content */}
      <div className="flex min-h-dvh w-full flex-col justify-center px-6 py-10 sm:px-12 md:px-16 lg:px-12 xl:px-20 bg-card">
        <div className="mx-auto w-full max-w-md">
          {/* Brand Logo placed above Form Field */}
          <div className="mb-8 flex justify-center">
            <Link href="/" aria-label="LifeCome Live home">
              <Image
                src="/brand/lifecome-live-logo.svg"
                alt="LifeCome Live"
                width={916}
                height={164}
                unoptimized
                className="h-8 w-auto sm:h-10"
              />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
