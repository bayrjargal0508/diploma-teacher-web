
import AuthMain from "@/components/providers/auth-main";
import {isAuthenticated} from "@/actions/cookies";
import {redirect} from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const isLogged = await isAuthenticated();
    if (isLogged) {
        redirect("/")
    }
  return (
    <div>
      <AuthMain>{children}</AuthMain>
    </div>
  );
}
