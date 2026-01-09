import { Recommendation, FundamentalMetrics, TechnicalIndicators } from '@/types/types';

export function generateRecommendation(
    fundamentals: FundamentalMetrics,
    technicals: TechnicalIndicators
): Recommendation {

    // Weights
    const fundWeight = 0.6; // Fundamentals are key for wealth management
    const techWeight = 0.4; // Technicals for timing

    const overallScore =
        (fundamentals.fundamentalScore * fundWeight) +
        (technicals.technicalScore * techWeight);

    let action: 'buy' | 'sell' | 'hold' = 'hold';

    if (overallScore >= 70) {
        action = 'buy';
    } else if (overallScore <= 40) {
        action = 'sell';
    } else {
        action = 'hold';
    }

    const reasoning = buildReasoning(fundamentals, technicals, action);

    return {
        action,
        confidence: Math.round(overallScore),
        reasoning
    };
}

function buildReasoning(
    fundamentals: FundamentalMetrics,
    technicals: TechnicalIndicators,
    action: string
): string {
    const parts = [];

    // Fundamental reason
    parts.push(`${fundamentals.companySize} company with ${fundamentals.tooBigToFailScore}/10 stability score`);

    if (fundamentals.valuationStatus === 'undervalued') {
        parts.push('Stocks appear undervalued based on historical averages');
    } else if (fundamentals.valuationStatus === 'overvalued') {
        parts.push('Current valuation is higher than historical norms');
    }

    // Technical reason
    if (technicals.rsi < 30) {
        parts.push('Technical indicators suggest oversold conditions (potential entry point)');
    } else if (technicals.rsi > 70) {
        parts.push('RSI indicates overbought conditions');
    } else if (technicals.technicalScore > 60) {
        parts.push('Momentum indicators are positive');
    }

    // Personal reason
    if (fundamentals.personalHistory.investedBefore) {
        parts.push(`Aligns with your history of ${fundamentals.personalHistory.timesInvested} previous investments`);
    }

    return `We recommend ${action.toUpperCase()}ing because: ${parts.join('. ')}.`;
}
