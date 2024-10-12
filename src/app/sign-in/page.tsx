'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ButtonLogin from './components/button-login';

export default function SignIn() {
	const { status } = useSession();
	if (status === 'authenticated') redirect('/');

	return (
		<div className="container mx-auto p-12 flex flex-col justify-center items-center h-screen space-y-6">
			<div className="flex flex-col items-center">
				<h1 className="text-2xl font-bold text-zinc-200">Bem vindo.</h1>
				<p className="text-base font-light text-zinc-400">
					Faça seu login para ter acesso ao Dashboard.
				</p>
			</div>
			<ButtonLogin />
		</div>
	);
}
