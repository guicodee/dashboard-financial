'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function ButtonOut() {
	return (
		<Button variant={'outline'} className="w-full" onClick={() => signOut()}>
			Sair
		</Button>
	);
}
