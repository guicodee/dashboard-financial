import AuthProvider from '@/components/providers/auth-provider';
import QueryProvider from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
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
		<html lang="pt-BR" className="dark" style={{ colorScheme: 'dark' }}>
			<body className={`${poppins.className} antialiased`}>
				<QueryProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Toaster />
						<AuthProvider>{children}</AuthProvider>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
