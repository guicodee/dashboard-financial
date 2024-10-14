'use server';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
	createNewTransactionSchema,
	createNewTransactionSchemaType,
} from '@/schema/transaction';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function CreateTransaction(
	form: createNewTransactionSchemaType
) {
	const parseBody = createNewTransactionSchema.safeParse(form);
	if (!parseBody.success) {
		throw new Error(parseBody.error.message);
	}

	const session = await getServerSession(authOptions);
	if (!session || !session.user) redirect('/sign-in');

	const { amount, category, date, type, description } = parseBody.data;

	try {
		await prisma.$transaction([
			prisma.transactions.create({
				data: {
					userId: (session.user as any).id,
					amount,
					date,
					type,
					category,
					description: description || '',
				},
			}),
		]);

		await prisma.monthHistory.upsert({
			where: {
				day_month_year_userId: {
					userId: (session.user as any).id,
					day: date.getUTCDate(),
					month: date.getUTCMonth(),
					year: date.getFullYear(),
				},
			},
			create: {
				userId: (session.user as any).id,
				day: date.getUTCDate(),
				month: date.getUTCMonth(),
				year: date.getFullYear(),
				expense: type === 'expense' ? amount : 0,
				income: type === 'income' ? amount : 0,
			},
			update: {
				expense: {
					increment: type === 'expense' ? amount : 0,
				},
				income: {
					increment: type === 'income' ? amount : 0,
				},
			},
		});

		await prisma.yearHistory.upsert({
			where: {
				month_year_userId: {
					userId: (session.user as any).id as string,
					month: date.getMonth(),
					year: date.getFullYear(),
				},
			},
			create: {
				userId: (session.user as any).id as string,
				month: date.getMonth(),
				year: date.getFullYear(),
				expense: type === 'expense' ? amount : 0,
				income: type === 'income' ? amount : 0,
			},
			update: {
				expense: {
					increment: type === 'expense' ? amount : 0,
				},
				income: {
					increment: type === 'income' ? amount : 0,
				},
			},
		});
	} catch (error) {
		console.error('Erro ao criar transação:', error);
		throw new Error('Erro ao criar transação');
	}
}
