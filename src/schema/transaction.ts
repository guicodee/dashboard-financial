import { z } from 'zod';

export const createNewTransactionSchema = z.object({
	description: z.string().optional(),
	amount: z.coerce.number().min(1).positive().multipleOf(0.01),
	date: z.coerce.date(),
	category: z.string().min(3).max(50),
	type: z.union([z.literal('income'), z.literal('expense')]),
});

export type createNewTransactionSchemaType = z.infer<
	typeof createNewTransactionSchema
>;
