import { recorridoService } from "@/lib/api/services/recorrido.service.server"
import RecorridoPanel from "./_components/recorrido-panel"
import { accountService } from "@/lib/api/services/account.service.server"

export default async function ResumenPage() {
  const me = await accountService.getMe()
  const recorrido = await recorridoService.get()

  if (!me) {
    return null
  }

  return <RecorridoPanel recorrido={recorrido} me={me} />
}
