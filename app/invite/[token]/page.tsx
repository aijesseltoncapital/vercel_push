import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function InvitePage({ params }: { params: { token: string } }) {
  const { token } = params

  // Store the invite token in a cookie
  cookies().set("invite_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    sameSite: "strict",
  })

  // Use the newer redirect pattern
  return redirect("/auth/signup")
}
