import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Skeleton } from './ui/skeleton';

interface SkeletonWrapperProps {
	children: ReactNode;
	isLoading: boolean;
	fullWidth?: boolean;
}

export default function SkeletonWrapper({
	children,
	fullWidth = true,
	isLoading,
}: SkeletonWrapperProps) {
	if (!isLoading) return children;

	return (
		<Skeleton className={cn(fullWidth && 'w-full')}>
			<div className="opacity-0">{children}</div>
		</Skeleton>
	);
}
