'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import TransactionsDataTable from './components/transactions-data-table';

export default function TransactionsPage() {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: startOfMonth(new Date()),
		to: new Date(),
	});

	return (
		<div className="flex flex-col w-full mr-4 mt-2">
			<div className="w-full bg-card h-24 px-5 py-4 mt-4 border border-zinc-900/80 flex items-center justify-between">
				<h1 className="text-2xl text-center">Transações</h1>
				<DateRangePicker
					initialDateFrom={dateRange.from}
					initialDateTo={dateRange.to}
					showCompare={false}
					onUpdate={(values) => {
						const { from, to } = values.range;
						if (!from || !to) return;

						if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
							toast.error(
								'As datas selecionadas são muito grande. As datas máxima permitida é 90 dias.'
							);
							return;
						}

						setDateRange({ from, to });
					}}
				/>
			</div>
			<TransactionsDataTable from={dateRange.from} to={dateRange.to} />
		</div>
	);
}
