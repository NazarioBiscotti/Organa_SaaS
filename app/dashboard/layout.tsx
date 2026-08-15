import Sidebar from "../../components/Sidebar"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<>
  
    <div className="flex min-h-screen m-auto w-2/3 text-gray-900">

      <aside className="w-64 module border-r">
        <h2 className="my-6">
          My SaaS
        </h2>

      <Sidebar />
      </aside>



      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  </>
  );
}