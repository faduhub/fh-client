import { SiteHeader } from "@/app/components/site-header"
import { Toast } from '@base-ui/react/toast';
import { Toaster } from "../components/ui/toast";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <Toast.Provider>
      <SiteHeader />
      {children}
      <Toaster />
      </Toast.Provider>
    </>
  )
}
