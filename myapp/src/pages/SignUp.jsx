import { SignUp } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";

export default function SignUpPage() {
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex bg-[#040404] text-white overflow-hidden">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center px-10">
        {/* Ambient gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-20 w-80 h-80 bg-[#4790fd]/25 rounded-full blur-3xl" />
          <div className="absolute bottom-[-120px] -right-32 w-96 h-96 bg-[#c76191]/25 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-[420px] h-[420px] bg-[#27dc66]/18 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-lg shadow-black/60">
              <img
                src="/LOGO/CCLOGOTW.avif"
                alt="Campus Connect Logo"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
                Campus Connect
              </p>
              <p className="text-[11px] text-white/40">
                Your campus, one unified network.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-[#27dc66] animate-pulse" />
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-white/70">
              Unified Under One Connection
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-semibold leading-tight">
            <span className="block text-white">Welcome to</span>
            <span className="mt-1 inline-block bg-gradient-to-r from-[#ece239] via-[#4790fd] to-[#27dc66] bg-clip-text text-transparent">
              Campus Connect
            </span>
          </h1>

          <p className="text-sm text-white/70 max-w-sm">
            Join a vibrant community of students, faculty and innovators. Post,
            collaborate on projects, and grow your campus network in one place.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-white/70">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <p className="font-semibold mb-1 text-white">Smart Networking</p>
              <p>Discover peers by skills, projects, and interests automatically.</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <p className="font-semibold mb-1 text-white">Campus-first Feed</p>
              <p>Stay on top of events, notices, and faculty announcements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10 bg-[#020308] lg:bg-[#040404]">
        <div className="w-full max-w-md relative">
          {/* Card glow */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#4790fd]/30 via-[#c76191]/25 to-[#27dc66]/30 blur-3xl opacity-60" />

          <div className="relative rounded-3xl bg-black/80 border border-white/10 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] px-5 py-6 sm:px-7 sm:py-8">
            <div className="mb-6 text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">
                Create account
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Sign up to Campus Connect
              </h2>
              <p className="mt-2 text-xs text-white/55">
                Use your college email to unlock all features.
              </p>
            </div>

            <SignUp
              appearance={{
                variables: {
                  colorPrimary: "#4790fd",
                  colorBackground: "transparent",
                  colorText: "#f5f5f5",
                  colorInputBackground: "#0b0b0b",
                  colorInputText: "#f5f5f5",
                },
                elements: {
                  card: "bg-transparent border-0 shadow-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20",
                  socialButtonsBlockButtonText:
                    "text-xs font-medium tracking-wide",
                  formFieldLabel:
                    "text-xs font-medium text-white/70 mb-1.5 tracking-wide",
                  formFieldInput:
                    "bg-[#050505] border border-white/10 text-sm text-white placeholder:text-white/35 rounded-xl px-3 py-2.5 focus:border-[#4790fd] focus:ring-0",
                  footerActionText: "text-xs text-white/50",
                  footerActionLink:
                    "text-xs text-[#4790fd] hover:text-white font-medium",
                  formButtonPrimary:
                    "mt-2 bg-[#4790fd] hover:bg-[#3775d4] text-sm font-semibold rounded-xl py-2.5",
                  dividerLine: "bg-white/10",
                  dividerText:
                    "text-[10px] uppercase tracking-[0.25em] text-white/40",
                },
              }}
              signInUrl="/Login"
              additionalFields={[
                {
                  name: "enrollmentNumber",
                  label: "Enrollment Number",
                  placeholder: "Enter your enrollment number",
                  required: true,
                },
                {
                  name: "fullName",
                  label: "Full Name",
                  placeholder: "Enter your full name",
                  required: true,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
