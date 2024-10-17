'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ButtonDeleteAccount() {
	const { push } = useRouter();

	const { mutate, isPending, isSuccess } = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/delete-account`, { method: 'DELETE' });
			if (!response.ok) throw new Error('Erro ao deletar usuario');

			return response.json();
		},
		onSuccess: () => {
			toast.success('Usuário foi excluído com sucesso.');
		},
	});

	if (isSuccess) push('/sign-in');

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={'destructive'} className="w-full">
					Excluir conta
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tem certeza que deseja excluir sua conta?</DialogTitle>
					<DialogDescription>
						Ao confirmar a exclusão, todos os seus dados serão excluidos
						permanentemente
					</DialogDescription>
				</DialogHeader>
				<div className="mt-2">
					<DialogClose asChild>
						<Button
							variant={isPending ? 'outline' : 'destructive'}
							disabled={isPending}
							onClick={() => mutate()}
						>
							{isPending ? 'Excluindo usuário' : 'Excluir conta'}
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
