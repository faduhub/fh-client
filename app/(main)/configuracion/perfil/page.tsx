import { ProfilePanel } from "@/app/components/ui/profile-panel"
import { accountService } from "@/lib/api/services/account.service.server"

export default async function PerfilPage() {
  const me = await accountService.getMe()
  console.log(me)
  if (!me) return null
  return <ProfilePanel me={me} />
}
