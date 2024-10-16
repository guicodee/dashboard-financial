import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import InfoValuesOverview from './info-values-overview';

export default function Overview() {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: startOfMonth(new Date()),
		to: new Date(),
	});

	return (
		<div className="px-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Visão Geral</h1>
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
			<div className="mt-8">
				<InfoValuesOverview from={dateRange.from} to={dateRange.to} />
			</div>
		</div>
	);
}
