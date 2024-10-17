import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function DELETE(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) redirect('/sign-in');

	const userId = (session.user as any).id;

	try {
		const deleteUser = await prisma.user.delete({
			where: {
				email: session.user.email as string,
			},
		});

		const deleteTransactions = await prisma.transactions.deleteMany({
			where: {
				userId,
			},
		});

		const deleteMonthHistory = await prisma.monthHistory.deleteMany({
			where: {
				userId,
			},
		});

		const deleteYearHistory = await prisma.yearHistory.deleteMany({
			where: {
				userId,
			},
		});

		return Response.json({
			message: 'Usuário excluído com sucesso.',
			deleteUser,
			deleteTransactions,
			deleteMonthHistory,
			deleteYearHistory,
		});
	} catch (error) {
		return Response.json('Erro ao excluir usuário.', {
			status: 500,
		});
	}
}
