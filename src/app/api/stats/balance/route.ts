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

	const stats = await getBalanceStats(
		(session.user as any).id,
		queryParams.data.from,
		queryParams.data.to
	);

	return Response.json(stats);
}

export type getBalanceStatsType = Awaited<ReturnType<typeof getBalanceStats>>;
async function getBalanceStats(userId: string, from: Date, to: Date) {
	const totals = await prisma.transactions.groupBy({
		by: ['type'],
		where: {
			userId,
			date: {
				gte: from,
				lte: to,
			},
		},
		_sum: {
			amount: true,
		},
	});

	return {
		expense: totals.find((total) => total.type === 'expense')?._sum.amount || 0,
		income: totals.find((total) => total.type === 'income')?._sum.amount || 0,
	};
}
