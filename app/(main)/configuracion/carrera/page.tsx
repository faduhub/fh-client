import { CarreraPanel } from "@/app/components/ui/courses-panels"
import { MateriasPanel } from "@/app/components/ui/materias-panel"
import { accountService } from "@/lib/api/services/account.service.server"

export default async function CarreraPage() {
  const me = await accountService.getMe()
  if (!me) return null
  return (
    <div className="space-y-5">
      <CarreraPanel me={me} />
      <MateriasPanel />
    </div>
  )
}
