import NavBar from '@/components/navbar';
import { ReactNode } from 'react';

export default function layout({ children }: { children: ReactNode }) {
	return (
		<div className="relative flex h-screen w-full flex-col">
			<div className="w-full">
				<NavBar />
				{children}
			</div>
		</div>
	);
}
