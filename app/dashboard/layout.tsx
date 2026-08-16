import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full text-gray-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl ">
        {/* Sidebar */}
        <aside
          className="
            hidden
            w-64
            shrink-0
            border-r
            
            md:block
          "
        >
          <div className="mb-8 mt-5 flex items-center gap-3 px-5">
            <img
              src="/files/OrganaLogo.png"
              alt="Organa"
              className="h-10 w-10 object-contain"
            />

            <span className="logo">Organa</span>
          </div>

          <Sidebar />
        </aside>

        {/* Contenuto */}
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}