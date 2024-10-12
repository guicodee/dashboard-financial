'use client';

import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function ButtonLogin() {
	async function handleSignInGoogle() {
		await signIn('google');
	}

	return (
		<Button
			className="bg-lime-500 text-zinc-950 flex items-center gap-3 px-4 hover:bg-lime-400 transition-colors"
			onClick={handleSignInGoogle}
		>
			<LogIn className="h-4 w-4" />
			Login com Google
		</Button>
	);
}
