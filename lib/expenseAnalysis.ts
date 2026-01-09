import { Transaction, ExpenseSuggestion } from '@/types/types';

export function generateExpenseSuggestions(
    currentMonthExpenses: Transaction[],
    historicalExpenses: Transaction[]
): ExpenseSuggestion[] {
    const suggestions: ExpenseSuggestion[] = [];

    if (currentMonthExpenses.length === 0) return suggestions;

    // Group by category
    const currentByCategory = groupBy(currentMonthExpenses, 'category');

    // Calculate averages (simplified logic)
    // In real app, filtering historical by month is needed
    const historyByCategory = groupBy(historicalExpenses, 'category');

    Object.keys(currentByCategory).forEach(category => {
        const currentTotal = sumAmounts(currentByCategory[category]);

        // Mock historical average (randomized variation of current for demo)
        // or use actual history if available
        const historyItems = historyByCategory[category] || [];
        const avgTotal = historyItems.length > 0
            ? sumAmounts(historyItems) / 3 // Assume approx 3 months of history
            : currentTotal * 0.8; // Fallback mock

        const percentageChange = avgTotal > 0
            ? ((currentTotal - avgTotal) / avgTotal) * 100
            : 0;

        if (percentageChange > 20 && currentTotal > 1000) {
            suggestions.push({
                id: `sugg-${category}-${Date.now()}`,
                category,
                currentSpending: Math.round(currentTotal),
                averageSpending: Math.round(avgTotal),
                percentageChange: Math.round(percentageChange),
                suggestion: `Spending on ${category} is ${Math.round(percentageChange)}% higher than average. Review recent transactions.`,
                potentialSavings: Math.round(currentTotal - avgTotal),
                priority: percentageChange > 50 ? 'high' : 'medium'
            });
        }
    });

    // Detect subscriptions (Mock logic: recurring same amount)
    // In real app, look for 'isRecurring' flag or same amount/merchant
    const subs = currentMonthExpenses.filter(e =>
        e.category.toLowerCase().includes('subscription') ||
        e.description.toLowerCase().includes('netflix') ||
        e.description.toLowerCase().includes('spotify')
    );

    if (subs.length > 2) {
        const totalSubCost = sumAmounts(subs);
        suggestions.push({
            id: 'sugg-subs',
            category: 'Subscriptions',
            currentSpending: totalSubCost,
            averageSpending: totalSubCost, // assume constant
            percentageChange: 0,
            suggestion: `You have ${subs.length} active subscriptions. Cancel unused ones to save.`,
            potentialSavings: Math.round(totalSubCost * 0.2), // 20% savings
            priority: 'medium'
        });
    }

    // Detect Dining frequency
    const dining = currentMonthExpenses.filter(e => e.category === 'Dining');
    if (dining.length > 5) {
        const totalDining = sumAmounts(dining);
        suggestions.push({
            id: 'sugg-dining',
            category: 'Dining',
            currentSpending: totalDining,
            averageSpending: 0,
            percentageChange: 0,
            suggestion: `You dined out ${dining.length} times. Cooking home more often could save significantly.`,
            potentialSavings: Math.round(totalDining * 0.3),
            priority: 'low'
        });
    }

    return suggestions.sort((a, b) => {
        const p = { high: 3, medium: 2, low: 1 };
        return p[b.priority] - p[a.priority];
    });
}

function groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}

function sumAmounts(transactions: Transaction[]) {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
}
