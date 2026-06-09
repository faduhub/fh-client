import { SiteHeader } from "@/app/components/site-header"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
