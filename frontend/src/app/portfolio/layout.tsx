import Navbar from "@/components/Navigation";
import ParticleBackground from "@/components/backgrounds/ParticleBackground";
import Container from "@/components/containers/Container";
import Identity from "@/components/Identity";
import TopNavigation from "@/components/common/TopNavigation";
import { AppProvider } from "@/components/context/AppContext";
import MobileSideNav from "@/components/common/MobileSideNav";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <AppProvider>
        {/* Background */}
        <ParticleBackground />

        {/* Mobile Top Navigation */}
        <div className="relative z-50 xl:hidden">
          <TopNavigation />
        </div>

        {/* Main Layout */}
        <Container>
          <div className="relative grid h-full w-full grid-cols-12 gap-5 overflow-hidden">

            {/* LEFT IDENTITY */}
            <aside className="relative col-span-3 hidden h-full xl:block">
              <div className="absolute left-0 top-1/2 h-3/4 w-full -translate-y-1/2">
                <div className="mx-2 h-full rounded-4xl">
                  <Identity />
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main
              id="main-content"
              className="mt-5 col-span-12 h-full overflow-y-auto xl:col-span-8"
            >
              {children}
            </main>

            {/* DESKTOP NAVIGATION */}
            <aside className="relative col-span-1 hidden h-full xl:block">
              <div className="absolute right-0 top-1/2 h-2/3 -translate-y-1/2">
                <div className="-mx-2 h-full rounded-4xl">
                  <Navbar />
                </div>
              </div>
            </aside>

          </div>
        </Container>

        {/* Mobile Side Navigation */}
        <MobileSideNav />
      </AppProvider>
    </div>
  );
}