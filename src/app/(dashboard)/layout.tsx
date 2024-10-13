import NavBar from '@/components/navbar';
import { ReactNode } from 'react';

export default function layout({ children }: { children: ReactNode }) {
	return (
		<div className="relative flex h-screen w-full">
			<div className="w-full flex overflow-hidden">
				<NavBar />
				{children}
			</div>
		</div>
	);
}
