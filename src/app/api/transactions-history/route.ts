import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { OverviewSchema } from '@/schema/overview';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) redirect('/sign-in');

	const { searchParams } = new URL(req.url);
	const from = searchParams.get('from');
	const to = searchParams.get('to');

	const queryParams = OverviewSchema.safeParse({ from, to });
	if (!queryParams.success) {
		return Response.json(queryParams.error.message, {
			status: 400,
		});
	}

	const transactions = await getTransactionsHistory(
		(session.user as any).id,
		queryParams.data.from,
		queryParams.data.to
	);

	return Response.json(transactions);
}

export type getTransactionsHistoryType = Awaited<
	ReturnType<typeof getTransactionsHistory>
>;
async function getTransactionsHistory(userId: string, from: Date, to: Date) {
	const transactions = await prisma.transactions.findMany({
		where: {
			userId,
			date: {
				gte: from,
				lte: to,
			},
		},
		orderBy: {
			date: 'asc',
		},
	});

	return transactions;
}
