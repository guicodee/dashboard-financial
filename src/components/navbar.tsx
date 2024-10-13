import { ArrowRightLeft, ChartBar, Settings } from 'lucide-react';
import Link from 'next/link';
import NavBarItem from './navbar-item';

export default function NavBar() {
	return (
		<div className="h-screen px-5 py-4 mt-4 mx-2 flex flex-col max-w-[200px]">
			<Link href={'/'} className="px-1.5">
				<img src="/logo.png" alt="Logo" width={30} height={30} />
			</Link>
			<div className="mt-8 flex flex-col gap-5 flex-1">
				<NavBarItem
					icon={<ChartBar className="h-6 w-6" />}
					link="/"
					label="Dashboard"
				/>
				<NavBarItem
					icon={<ArrowRightLeft className="h-6 w-6" />}
					link="/transactions"
					label="Transações"
				/>
				<NavBarItem
					icon={<Settings className="h-6 w-6" />}
					link="/settings"
					label="Configurações"
				/>
			</div>
		</div>
	);
}
