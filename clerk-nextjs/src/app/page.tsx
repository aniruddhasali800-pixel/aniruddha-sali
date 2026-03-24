import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-900 p-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-zinc-800">Auth System</h1>
        
        <SignedOut>
          <div className="text-center space-y-6">
            <p className="text-zinc-500">Welcome back. Please sign in to securely access your dashboard and manage files.</p>
            <SignInButton mode="modal">
              <button className="w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
              <span className="text-zinc-600 font-medium">Logged in as:</span>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
            </div>
            <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-md font-medium border border-green-100">
              Authentication successful! You can now access protected routes.
            </p>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
