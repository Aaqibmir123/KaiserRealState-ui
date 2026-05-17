import { redirect } from "next/navigation";

export default function AdminForgotPasswordRedirectPage() {
  redirect("/forgot-password");
}
