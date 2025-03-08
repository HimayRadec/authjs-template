import { auth } from "@/auth"
import GoogleSignInButton from "@/components/auth/GoogleSignInButton"
import { SignOut } from "@/components/auth/signout-button"

export default async function Page() {
  const session = await auth()
  if (!session) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
      <GoogleSignInButton />
    </div>
  )


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <div className="border px-4 py-2 rounded-lg shadow-md">
        <SignOut />
      </div>
    </div>
  )
}