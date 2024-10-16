import { Card } from '@/components/ui/card';
import { TransactionType } from '@/lib/types';
import { ReactNode } from 'react';
import CountUp from 'react-countup';

interface ValuesOverviewProps {
	type: TransactionType;
	icon: ReactNode;
	title: string;
	value: number;
}

export default function ValuesOverview({
	icon,
	title,
	type,
	value,
}: ValuesOverviewProps) {
	return (
		<Card className="w-full h-24 p-4 flex items-center gap-2">
			{icon}
			<div className="">
				<h1 className="text-muted-foreground text-start">{title}</h1>
				<p className="text-xl font-bold">
					R$
					<CountUp
						preserveValue
						redraw={false}
						end={value}
						decimals={1}
						className="ml-1"
					/>
				</p>
			</div>
		</Card>
	);
}
