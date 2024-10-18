import { GetHistoryPeriodsType } from '@/app/api/history-periods/route';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Period, Timeframe } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import MonthSelector from './month-selector';
import YearSelector from './year-selector';

interface HistoryPeriodSelectorProps {
	period: Period;
	setPeriod: (period: Period) => void;
	timeframe: Timeframe;
	setTimeframe: (timeframe: Timeframe) => void;
}

export default function HistoryPeriodSelector({
	period,
	setPeriod,
	setTimeframe,
	timeframe,
}: HistoryPeriodSelectorProps) {
	const historyPeriods = useQuery<GetHistoryPeriodsType>({
		queryKey: ['overview', 'history', 'periods'],
		queryFn: () => fetch('/api/history-periods').then((res) => res.json()),
	});

	return (
		<div className="flex flex-wrap items-center gap-4">
			<SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
				<Tabs
					value={timeframe}
					onValueChange={(value) => setTimeframe(value as Timeframe)}
				>
					<TabsList>
						<TabsTrigger value="year">Ano</TabsTrigger>
						<TabsTrigger value="month">Mês</TabsTrigger>
					</TabsList>
				</Tabs>
			</SkeletonWrapper>
			<div className="flex flex-wrap items-center gap-2">
				<SkeletonWrapper isLoading={historyPeriods.isFetching}>
					<YearSelector
						period={period}
						setPeriod={setPeriod}
						years={historyPeriods.data || []}
					/>
				</SkeletonWrapper>
				{timeframe === 'month' && (
					<SkeletonWrapper
						isLoading={historyPeriods.isFetching}
						fullWidth={false}
					>
						<MonthSelector period={period} setPeriod={setPeriod} />
					</SkeletonWrapper>
				)}
			</div>
		</div>
	);
}
