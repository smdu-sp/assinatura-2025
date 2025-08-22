import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OpenRoutesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (session) {
		redirect("/");
	}
	return children;
}