import { RecurringTransaction, Transaction } from '@/types/types';

export function checkForRecurringGenerations(
    recurring: RecurringTransaction[],
    existingTransactions: Transaction[]
): Transaction[] {
    const newTransactions: Transaction[] = [];
    const today = new Date();

    recurring.forEach(rule => {
        if (!rule.isActive) return;

        // Simplified logic: Check if transaction exists for current month/period
        // In real app, complex date math needed

        // Assume monthly for MVP
        const alreadyGenerated = existingTransactions.some(t =>
            t.recurringId === rule.id &&
            new Date(t.date).getMonth() === today.getMonth() &&
            new Date(t.date).getFullYear() === today.getFullYear()
        );

        if (!alreadyGenerated) {
            // Determine date
            let targetDate = new Date();
            if (rule.recurrence.type === 'monthly' && rule.recurrence.dayOfMonth) {
                targetDate.setDate(rule.recurrence.dayOfMonth);
            }

            // If target date passed or is today, generate
            if (targetDate <= today || true) { // Force generate for demo if not exists
                newTransactions.push({
                    id: `gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    date: targetDate.toISOString(),
                    type: rule.type === 'income' ? 'income' : 'expense', // cast type
                    category: rule.category,
                    amount: rule.amount,
                    description: rule.name + " (Recurring)",
                    isRecurring: true,
                    recurringId: rule.id,
                    acknowledged: rule.autoAcknowledge,
                    createdAt: new Date().toISOString()
                } as Transaction);
            }
        }
    });

    return newTransactions;
}
