import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Period, Timeframe } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import CustomTooltip from './custom-tooltip';
import HistoryPeriodSelector from './history-period-selector';

export default function HistoryCharts() {
	const [timeframe, setTimeframe] = useState<Timeframe>('month');
	const [period, setPeriod] = useState<Period>({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});

	const historyDataQuery = useQuery({
		queryKey: ['overview', 'history', timeframe, period],
		queryFn: () =>
			fetch(
				`/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
			).then((res) => res.json()),
	});

	const dataAvailable =
		historyDataQuery.data && historyDataQuery.data.length > 0;

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
				<CardContent>
					<SkeletonWrapper isLoading={historyDataQuery.isFetching}>
						{dataAvailable && (
							<ResponsiveContainer width={'100%'} height={300}>
								<BarChart
									height={300}
									data={historyDataQuery.data}
									barCategoryGap={5}
								>
									<defs>
										<linearGradient id="incomeBar" x1={0} y1={0} x2={0} y2={1}>
											<stop
												offset={'0'}
												stopColor="#10b981"
												stopOpacity={'1'}
											/>
											<stop
												offset={'1'}
												stopColor="#10b981"
												stopOpacity={'0'}
											/>
										</linearGradient>

										<linearGradient id="expenseBar" x1={0} y1={0} x2={0} y2={1}>
											<stop
												offset={'0'}
												stopColor="#ef4444"
												stopOpacity={'1'}
											/>
											<stop
												offset={'1'}
												stopColor="#ef4444"
												stopOpacity={'0'}
											/>
										</linearGradient>
									</defs>

									<CartesianGrid
										strokeDasharray="5 5"
										strokeOpacity={0.2}
										vertical={false}
									/>

									<XAxis
										stroke="#888888"
										fontSize={12}
										tickLine={false}
										axisLine={false}
										padding={{ left: 5, right: 5 }}
										dataKey={(data) => {
											const { year, month, day } = data;
											const date = new Date(year, month, day || 1);

											if (timeframe === 'year') {
												return date.toLocaleDateString('default', {
													month: 'long',
												});
											}
											return date.toLocaleDateString('default', {
												day: '2-digit',
											});
										}}
									/>

									<YAxis
										stroke="#888888"
										fontSize={12}
										tickLine={false}
										axisLine={false}
									/>

									<Bar
										dataKey={'income'}
										label="Entrada"
										fill="url(#incomeBar)"
										radius={4}
										className="cursor-pointer"
									/>

									<Bar
										dataKey={'expense'}
										label="Saída"
										fill="url(#expenseBar)"
										radius={4}
										className="cursor-pointer"
									/>

									<Tooltip
										cursor={{ opacity: 0.1 }}
										content={(props) => <CustomTooltip {...props} />}
									/>
								</BarChart>
							</ResponsiveContainer>
						)}
						{!dataAvailable && (
							<Card className="flex h-[300px] flex-col items-center justify-center bg-background">
								Não há dados para o período selecionado.
								<p className="text-sm text-muted-foreground">
									Selecione um período diferente ou adicione uma nova transação.
								</p>
							</Card>
						)}
					</SkeletonWrapper>
				</CardContent>
			</Card>
		</div>
	);
}
