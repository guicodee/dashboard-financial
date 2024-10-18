import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Period, Timeframe } from '@/lib/types';
import { useState } from 'react';
import HistoryPeriodSelector from './history-period-selector';

export default function HistoryCharts() {
	const [timeframe, setTimeframe] = useState<Timeframe>('month');
	const [period, setPeriod] = useState<Period>({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});

	return (
		<div className="px-4">
			<h2 className="text-2xl font-bold mt-12">Histórico</h2>
			<Card className="col-span-12 mt-2 w-full">
				<CardHeader className="gap-2">
					<CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
						<HistoryPeriodSelector
							period={period}
							setPeriod={setPeriod}
							timeframe={timeframe}
							setTimeframe={setTimeframe}
						/>
						<div className="flex gap-2">
							<Badge
								className="flex items-center gap-2 text-sm"
								variant={'outline'}
							>
								<div className="w-3 h-3 rounded-full bg-emerald-500"></div>
								Entrada
							</Badge>
							<Badge
								className="flex items-center gap-2 text-sm"
								variant={'outline'}
							>
								<div className="w-3 h-3 rounded-full bg-red-500"></div>
								Saída
							</Badge>
						</div>
					</CardTitle>
				</CardHeader>
			</Card>
		</div>
	);
}
