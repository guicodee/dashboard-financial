import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ weight: '400', subsets: ['latin'] });
export const metadata: Metadata = {
	title: 'Organizador financeiro',
	description:
		'A ferramenta ideal para quem busca organizar suas finanças de forma prática e eficiente.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={`${poppins.className} antialiased`}>{children}</body>
		</html>
	);
}
