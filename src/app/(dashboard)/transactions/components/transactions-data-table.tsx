import { getTransactionsHistoryType } from '@/app/api/transactions-history/route';
import { DataTableColumnHeader } from '@/components/data-table/colum-header';
import { DataTableViewOptions } from '@/components/data-table/colum-toggle';
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import DateToUTCDate from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

interface TransactionsDataTableProps {
	from: Date;
	to: Date;
}

const emptyData: any[] = [];
type TransactionHistoryRow = getTransactionsHistoryType[0];
export const columns: ColumnDef<TransactionHistoryRow>[] = [
	{
		accessorKey: 'category',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Categoria" />
		),
	},
	{
		accessorKey: 'descrição',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Descrição" />
		),
		cell: ({ row }) => (
			<div className="capitalize">{row.original.description}</div>
		),
	},
	{
		accessorKey: 'data',
		header: 'Data',
		cell: ({ row }) => {
			const date = new Date(row.original.date);
			const formatterDate = date.toLocaleDateString('default', {
				timeZone: 'UTC',
				year: '2-digit',
				month: '2-digit',
				day: '2-digit',
			});
			return <div className="text-muted-foreground">{formatterDate}</div>;
		},
	},
	{
		accessorKey: 'type',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Tipo" />
		),
		cell: ({ row }) => {
			return (
				<div
					className={cn(
						'capitalize rounded-lg text-center p-2',
						row.original.type === 'income' &&
							'bg-emerald-500/10 text-emerald-500',
						row.original.type === 'expense' && 'bg-red-400/10 text-red-500'
					)}
				>
					{row.original.type === 'income' ? 'Ganhos' : 'Gastos'}
				</div>
			);
		},
	},
	{
		accessorKey: 'valor',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Valor" />
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
		cell: ({ row }) => {
			return (
				<p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
					R$ {row.original.amount.toFixed(2)}
				</p>
			);
		},
	},
];

export default function TransactionsDataTable({
	from,
	to,
}: TransactionsDataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const transactionHistory = useQuery({
		queryKey: ['transactions', 'history', from, to],
		queryFn: () =>
			fetch(
				`/api/transactions-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
			).then((res) => res.json()),
	});

	const table = useReactTable({
		data: transactionHistory.data || emptyData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		initialState: {
			pagination: {
				pageSize: 8,
			},
		},
		state: {
			sorting,
			columnFilters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="w-full">
			<div className="flex flex-wrap items-end justify-between gap-2 py-4">
				<div className="flex gap-2">
					{table.getColumn('type') && (
						<DataTableFacetedFilter
							title="Tipos"
							column={table.getColumn('type')}
							options={[
								{ label: 'Ganhos', value: 'income' },
								{ label: 'Gastos', value: 'expense' },
							]}
						/>
					)}
				</div>
				<div className="flex flex-wrap gap-2">
					<DataTableViewOptions table={table} />
				</div>
			</div>
			<SkeletonWrapper isLoading={transactionHistory.isFetching}>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Próxima
					</Button>
				</div>
			</SkeletonWrapper>
		</div>
	);
}
