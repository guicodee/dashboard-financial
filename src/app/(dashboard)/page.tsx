'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import CreateNewTransaction from './components/create-new-transaction';

export default function Page() {
	const { data, status } = useSession();
	if (status === 'unauthenticated') redirect('/sign-in');
	if (!data || !data.user) redirect('/sign-in');

	return (
		<div className="w-full bg-card h-24 px-5 py-4 mt-4 mx-2 border border-zinc-900/80 flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-bold text-center">
					Olá, {data.user.name?.split(' ')?.[0]}! 👋
				</h1>
			</div>
			<div className="flex items-center gap-4">
				<CreateNewTransaction type="income" />
				<CreateNewTransaction type="expense" />
			</div>
		</div>
	);
}
