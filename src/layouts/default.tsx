
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 lg:pl-64">
        <div className="w-full h-full px-4 sm:px-6 lg:px-6 xl:px-8 py-6 lg:py-8">
          <div className="w-full mx-auto max-w-7xl ">

            {children}
          </div>
        </div>
      </main>
    
    </div>
  );
}
