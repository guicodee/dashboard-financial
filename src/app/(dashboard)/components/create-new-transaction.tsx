'use client';

import CreateTransaction from '@/app/actions/create-transaction';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import DateToUTCDate from '@/lib/helpers';
import { cn } from '@/lib/utils';
import {
	createNewTransactionSchema,
	createNewTransactionSchemaType,
} from '@/schema/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateNewTransactionProps {
	type: 'income' | 'expense';
}

export default function CreateNewTransaction({
	type,
}: CreateNewTransactionProps) {
	const form = useForm<createNewTransactionSchemaType>({
		resolver: zodResolver(createNewTransactionSchema),
		defaultValues: {
			type,
			date: new Date(),
		},
	});

	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: CreateTransaction,
		onSuccess: () => {
			toast.success('Transação criada com sucesso 🎉', {
				id: 'create-transaction',
			});

			form.reset({
				amount: 1,
				category: '',
				date: new Date(),
				description: '',
				type,
			});

			queryClient.invalidateQueries({
				queryKey: ['overview'],
			});
		},
		onError: (error) => {
			toast.error(`Transação falhou. ${error}`, {
				id: 'create-transaction',
			});
		},
	});

	const onSubmit = useCallback(
		(values: createNewTransactionSchemaType) => {
			toast.loading('Criando transação...', {
				id: 'create-transaction',
			});

			mutate({
				...values,
				date: DateToUTCDate(values.date),
			});
		},
		[mutate]
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className={cn(
						type === 'income'
							? 'border border-emerald-400 bg-emerald-800 text-zinc-50 hover:bg-emerald-700 transition-colors'
							: 'border border-red-400 bg-red-800 text-zinc-50 hover:bg-red-700 transition-colors'
					)}
				>
					Nova transação
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Nova transação do tipo{' '}
						{type === 'income' ? (
							<span className="text-emerald-600">entrada</span>
						) : (
							<span className="text-red-500">saída</span>
						)}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-1">
										<FormLabel>Descrição</FormLabel>
										<FormDescription>opcional</FormDescription>
									</div>
									<FormControl>
										<Input
											placeholder="Digite uma descrição para sua transação"
											defaultValue={''}
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-1">
										<FormLabel>Categoria</FormLabel>
										<FormDescription>obrigatório</FormDescription>
									</div>
									<FormControl>
										<Input
											placeholder="Digite o nome da sua categoria"
											defaultValue={''}
											{...field}
										/>
									</FormControl>
									<span className="text-red-300 text-sm">
										{form.formState.errors.category?.message &&
											'Digite uma categoria.'}
									</span>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-1">
										<FormLabel>Valor</FormLabel>
										<FormDescription>obrigatório</FormDescription>
									</div>
									<FormControl>
										<Input
											type="number"
											placeholder="Digite o valor da sua transação"
											defaultValue={0}
											min={2}
											{...field}
										/>
									</FormControl>
									<span className="text-red-300 text-sm">
										{form.formState.errors.amount?.message &&
											'Digite um valor.'}
									</span>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-1">
										<FormLabel>Data</FormLabel>
										<FormDescription>obrigatório</FormDescription>
									</div>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'w-[300px] flex items-center gap-2 justify-start text-left',
															!field.value && 'text-muted-foreground'
														)}
													>
														<CalendarIcon size={16} />
														{field.value
															? format(field.value, 'PPP')
															: 'Selecione uma data'}
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={(value) => {
														if (!value) return;
														field.onChange(value);
													}}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter className="flex items-center justify-end gap-2 mt-4">
					<DialogClose asChild>
						<Button
							variant={'secondary'}
							type="button"
							onClick={() => form.reset()}
						>
							Cancelar
						</Button>
					</DialogClose>
					<Button
						type="submit"
						onClick={form.handleSubmit(onSubmit)}
						disabled={isPending}
					>
						{isPending ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							'Criar transação'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
