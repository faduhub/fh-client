import { CursadasPanel } from "@/app/components/ui/cursadas-panel"
import { accountService } from "@/lib/api/services/account.service.server"

export default async function CursadasPage() {
  const me = await accountService.getMe()
  if (!me) return null

  return <CursadasPanel me={me} />
}
