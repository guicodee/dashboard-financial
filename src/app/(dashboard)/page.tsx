'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import CreateNewTransaction from './components/create-new-transaction';
import HistoryCharts from './components/history-charts';
import Overview from './components/overview';

export default function Page() {
	const { data, status } = useSession();
	if (status === 'unauthenticated') redirect('/sign-in');
	if (!data || !data.user) redirect('/sign-in');

	return (
		<div className="flex flex-col w-full mr-4 mt-2">
			<div className="w-full bg-card h-24 px-5 py-4 mt-4 border border-zinc-900/80 flex items-center justify-between">
				<div>
					<h1 className="text-2xl text-center">
						Olá,{' '}
						<span className="font-black">
							{data.user.name?.split(' ')?.[0]}! 👋
						</span>
					</h1>
				</div>
				<div className="flex items-center gap-4">
					<CreateNewTransaction type="income" />
					<CreateNewTransaction type="expense" />
				</div>
			</div>
			<div className="mt-8">
				<Overview />
			</div>
			<div className="mt-8">
				<HistoryCharts />
			</div>
		</div>
	);
}
