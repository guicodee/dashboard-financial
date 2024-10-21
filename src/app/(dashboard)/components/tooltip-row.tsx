import { cn } from '@/lib/utils';
import CountUp from 'react-countup';

interface TooltipRowProps {
	label: string;
	bgColor: string;
	textColor: string;
	value: number;
}

export default function TooltipRow({
	bgColor,
	label,
	textColor,
	value,
}: TooltipRowProps) {
	return (
		<div className="flex items-center gap-2">
			<div className={cn('h-4 w-4 rounded-full', bgColor)} />
			<div className="flex w-full justify-between">
				<p className="text-sm text-muted-foreground">{label}</p>
				<div className={cn('text-sm font-bold', textColor)}>
					<CountUp
						duration={0.5}
						preserveValue
						end={value}
						decimals={0}
						className="text-sm"
					/>
				</div>
			</div>
		</div>
	);
}
