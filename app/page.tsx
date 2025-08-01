import { auth } from "@/auth";
import { InputForm } from "./_components/form";
import Sair from "./_components/Sair";

/** @format */
export default async function Home() {
	const session = await auth();
	return (
		<div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
			<div className='flex w-full max-w-xl flex-col gap-6'>
				<InputForm session={session} />
				<Sair session={session} />
			</div>
		</div>
	);
}