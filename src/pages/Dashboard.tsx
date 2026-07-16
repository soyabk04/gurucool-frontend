import Login2 from "../components/login2";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";



const Dashboard=()=>{
    return(
<>    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-semibold">GuruCool</h1>
        </header>

        <main className="p-6">
          hello
        </main>
      </SidebarInset>
    </SidebarProvider>
    </>
//   
    )
}

export default Dashboard