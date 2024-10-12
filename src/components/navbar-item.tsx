'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';

interface NavBarItemProps {
	link: string;
	icon: ReactNode;
	label: string;
}

export default function NavBarItem({ icon, link, label }: NavBarItemProps) {
	const pathname = usePathname();
	const isActive = pathname === link;

	return (
		<>
			<TooltipProvider delayDuration={200}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href={link}
							className={cn(
								'bg-zinc-900 w-fit p-3 rounded-lg hover:bg-zinc-800 transition-colors',
								isActive && 'bg-lime-400 hover:bg-lime-500 text-zinc-950'
							)}
						>
							{icon}
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>{label}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</>
	);
}
