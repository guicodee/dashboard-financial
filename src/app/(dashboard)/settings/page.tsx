import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ButtonDeleteAccount from './components/button-delete-account';
import ButtonOut from './components/button-out';

export default async function SettingsPage() {
	const user = await getServerSession(authOptions);
	if (!user || !user.user) redirect('/sign-in');

	return (
		<div className="container mx-auto mt-4 py-4 flex flex-col">
			<h1 className="text-2xl font-bold">Configurações</h1>
			<div className="mt-12 flex gap-12 w-full">
				<div className="flex flex-col">
					<h2 className="text-lg font-bold">Perfil</h2>
					<p className="text-muted-foreground text-sm">
						Isso é exibido no seu perfil
					</p>
				</div>
				<div className="flex flex-col gap-3 w-96">
					<Input value={user.user.email as string} disabled={true} />
					<Input value={user.user.name as string} />
				</div>
			</div>
			<div className="mt-12">
				<Separator />
				<div className="flex items-center mt-8 w-full gap-4">
					<div className="flex flex-col">
						<h2 className="text-lg font-bold">Sair</h2>
						<p className="text-muted-foreground text-sm max-w-[300px]">
							Para sair da sua conta, basta clicar no botão ao lado "Sair".
						</p>
					</div>
					<div className="w-[300px]">
						<ButtonOut />
					</div>
				</div>
			</div>
			<div className="mt-12">
				<Separator />
				<div className="flex items-center mt-8 w-full gap-4">
					<div className="flex flex-col">
						<h2 className="text-lg font-bold">Excluir conta</h2>
						<p className="text-muted-foreground text-sm max-w-[300px]">
							Caso queira excluir permanentemente a sua conta, basta clicar no
							botão ao lado "Excluir".
							<br />
						</p>
					</div>
					<div className="w-[300px]">
						<ButtonDeleteAccount />
					</div>
				</div>
			</div>
		</div>
	);
}
