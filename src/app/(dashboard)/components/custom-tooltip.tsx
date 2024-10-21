import TooltipRow from './tooltip-row';

export default function CustomTooltip({ active, payload }: any) {
	if (!active || !payload || payload.length === 0) return null;

	const data = payload[0].payload;
	const { expense, income } = data;

	return (
		<div className="min-w-[300px] rounded border bg-background p-4">
			<TooltipRow
				label="Entrada"
				value={income}
				bgColor="bg-emerald-500"
				textColor="text-emerald-500"
			/>
			<TooltipRow
				label="Saída"
				value={expense}
				bgColor="bg-red-500"
				textColor="text-red-500"
			/>
			<TooltipRow
				label="Saldo"
				value={income - expense}
				bgColor="bg-blue-500"
				textColor="text-blue-500"
			/>
		</div>
	);
}
