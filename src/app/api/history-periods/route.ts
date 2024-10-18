import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) redirect('/sign-in');

	const periods = await getHistoryPeriods((session.user as any).id);
	return Response.json(periods);
}

export type GetHistoryPeriodsType = Awaited<
	ReturnType<typeof getHistoryPeriods>
>;
async function getHistoryPeriods(userId: string) {
	const result = await prisma.monthHistory.findMany({
		where: {
			userId,
		},
		select: {
			year: true,
		},
		distinct: ['year'],
		orderBy: [
			{
				year: 'asc',
			},
		],
	});

	const years = result.map(({ year }) => year);
	if (years.length === 0) {
		return [new Date().getFullYear()];
	}

	return years;
}
