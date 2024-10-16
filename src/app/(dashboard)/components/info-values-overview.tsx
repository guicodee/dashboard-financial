import { getBalanceStatsType } from '@/app/api/stats/balance/route';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import DateToUTCDate from '@/lib/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, WalletMinimal } from 'lucide-react';
import ValuesOverview from './values-overview';

interface InfoValuesOverviewProps {
	from: Date;
	to: Date;
}

export default function InfoValuesOverview({
	from,
	to,
}: InfoValuesOverviewProps) {
	const { data, isLoading } = useQuery<getBalanceStatsType>({
		queryKey: ['overview', 'stats', from, to],
		queryFn: () =>
			fetch(
				`/api/stats/balance?from=${DateToUTCDate(from).toISOString()}&to=${DateToUTCDate(to).toISOString()}`
			).then((res) => res.json()),
	});

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (newTransaction) =>
			fetch('/api/transactions', {
				method: 'POST',
				body: JSON.stringify(newTransaction),
			}).then((res) => res.json()),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['overview', 'stats', from, to],
			});
		},
	});

	const income = data?.income || 0;
	const expense = data?.expense || 0;
	const balance = income - expense;

	return (
		<div className="grid grid-cols-3 gap-2">
			<SkeletonWrapper isLoading={isLoading}>
				<ValuesOverview
					icon={
						<TrendingUp className="h-12 w-12 bg-emerald-400/10 text-emerald-500 p-2 rounded-lg" />
					}
					title="Ganhos"
					type={'income'}
					value={income}
				/>
			</SkeletonWrapper>

			<SkeletonWrapper isLoading={isLoading}>
				<ValuesOverview
					icon={
						<TrendingDown className="h-12 w-12 bg-red-400/10 text-red-500 p-2 rounded-lg" />
					}
					title="Gastos"
					type={'income'}
					value={expense}
				/>
			</SkeletonWrapper>

			<SkeletonWrapper isLoading={isLoading}>
				<ValuesOverview
					icon={
						<WalletMinimal className="h-12 w-12 bg-blue-400/10 text-blue-500 p-2 rounded-lg" />
					}
					title="Saldo"
					type={'income'}
					value={balance}
				/>
			</SkeletonWrapper>
		</div>
	);
}
