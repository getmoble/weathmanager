import { Stock, FundamentalMetrics } from '@/types/types';

export function analyzeFundamentals(stock: Partial<Stock>): FundamentalMetrics {
    // Simplified logic for demo purposes
    // In a real app, this would use live financial data

    const marketCap = stock.marketCap || 0;

    // 1. Determine Company Size
    let companySize: 'mega' | 'large' | 'mid' | 'small' = 'small';
    let marketCapTier = 'Small Cap (<$2B)';

    if (marketCap > 200_000_000_000) { // $200B
        companySize = 'mega';
        marketCapTier = 'Mega Cap (>$200B)';
    } else if (marketCap > 10_000_000_000) { // $10B
        companySize = 'large';
        marketCapTier = 'Large Cap ($10B-$200B)';
    } else if (marketCap > 2_000_000_000) { // $2B
        companySize = 'mid';
        marketCapTier = 'Mid Cap ($2B-$10B)';
    }

    // 2. Valuation Status (Mock logic based on random factors for demo)
    // Real implementation would compare P/E, P/B vs sector avg
    const valuationRandom = Math.random();
    let valuationStatus: 'undervalued' | 'fairly-valued' | 'overvalued' = 'fairly-valued';
    let currentVsAverage = 0;

    if (valuationRandom > 0.7) {
        valuationStatus = 'overvalued';
        currentVsAverage = Math.floor(Math.random() * 20) + 5;
    } else if (valuationRandom < 0.3) {
        valuationStatus = 'undervalued';
        currentVsAverage = -(Math.floor(Math.random() * 20) + 5);
    }

    // 3. TBTF Score
    let tooBigToFailScore = 1;
    let tooBigToFailReason = "Niche market player with limited systemic impact.";

    if (companySize === 'mega') {
        tooBigToFailScore = 9;
        tooBigToFailReason = "Critical systemic importance with massive market share.";
    } else if (companySize === 'large') {
        tooBigToFailScore = 6;
        tooBigToFailReason = "Significant industry player with high visibility.";
    }

    // 4. Historical Track Record
    const historicalReturn5Y = (Math.random() * 100) + 20; // 20-120%
    const consistency = historicalReturn5Y > 80 ? 'high' : historicalReturn5Y > 40 ? 'medium' : 'low';

    // 5. Personal History (Mock)
    const personalHistory = {
        investedBefore: Math.random() > 0.5,
        timesInvested: Math.floor(Math.random() * 5),
        pastReturns: [12, 15],
        trustScore: 'high' as const // detailed logic omitted for brevity
    };

    // 6. Overall Score
    let score = 50;
    if (companySize === 'mega' || companySize === 'large') score += 20;
    if (valuationStatus === 'undervalued') score += 20;
    if (consistency === 'high') score += 10;

    return {
        companySize,
        marketCapTier,
        valuationStatus,
        currentVsAverage,
        tooBigToFailScore,
        tooBigToFailReason,
        historicalReturn5Y,
        consistency,
        resilienceDuringDownturns: 'strong',
        personalHistory,
        fundamentalScore: Math.min(score, 100)
    };
}
