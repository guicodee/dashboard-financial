import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Period, Timeframe } from '@/lib/types';
import { getDaysInMonth } from 'date-fns';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const getHistoryDataSchema = z.object({
	timeframe: z.enum(['month', 'year']),
	month: z.coerce.number().min(0).max(11).default(0),
	year: z.coerce.number().min(2000).max(3000),
});

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) redirect('/sign-in');

	const { searchParams } = new URL(req.url);
	const timeframe = searchParams.get('timeframe');
	const year = searchParams.get('year');
	const month = searchParams.get('month');

	const queryParams = getHistoryDataSchema.safeParse({
		timeframe,
		year,
		month,
	});

	if (!queryParams.success) {
		return Response.json(queryParams.error.message, {
			status: 400,
		});
	}

	const data = await getHistoryData(
		(session.user as any).id,
		queryParams.data.timeframe,
		{
			month: queryParams.data.month,
			year: queryParams.data.year,
		}
	);
	return Response.json(data);
}

export type getHistoryDataType = Awaited<ReturnType<typeof getHistoryData>>;
async function getHistoryData(
	userId: string,
	timeframe: Timeframe,
	period: Period
) {
	switch (timeframe) {
		case 'year':
			return await getYearHistoryData(userId, period.year);
		case 'month':
			return await getMonthHistoryData(userId, period.year, period.month);
	}
}

type HistoryData = {
	expense: number;
	income: number;
	month: number;
	year: number;
	day?: number;
};
async function getYearHistoryData(userId: string, year: number) {
	const result = await prisma.yearHistory.groupBy({
		by: ['month'],
		where: {
			userId,
			year,
		},
		_sum: {
			expense: true,
			income: true,
		},
		orderBy: [
			{
				month: 'asc',
			},
		],
	});

	if (!result || result.length === 0) return [];
	const history: HistoryData[] = [];

	for (let i = 0; i < 12; i++) {
		let expense = 0;
		let income = 0;

		const month = result.find(({ month }) => month === i);
		if (month) {
			expense = month._sum.expense || 0;
			income = month._sum.expense || 0;
		}

		history.push({
			year,
			expense,
			income,
			month: i,
		});
	}

	return history;
}

async function getMonthHistoryData(
	userId: string,
	year: number,
	month: number
) {
	const result = await prisma.monthHistory.groupBy({
		by: ['day'],
		where: {
			userId,
			year,
			month,
		},
		_sum: {
			expense: true,
			income: true,
		},
		orderBy: [
			{
				day: 'asc',
			},
		],
	});

	if (!result || result.length === 0) return [];

	const history: HistoryData[] = [];
	const dayInMonth = getDaysInMonth(new Date(year, month));

	for (let i = 0; i <= dayInMonth; i++) {
		let expense = 0;
		let income = 0;

		const day = result.find(({ day }) => day === i);
		if (day) {
			expense = day._sum.expense || 0;
			income = day._sum.income || 0;
		}

		history.push({
			expense,
			income,
			month,
			year,
			day: i,
		});
	}

	return history;
}
