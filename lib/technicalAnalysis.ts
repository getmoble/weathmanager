import { TechnicalIndicators } from '@/types/types';

export function analyzeTechnicals(prices: number[]): TechnicalIndicators {
    // prices array: index 0 is oldest, last index is latest
    if (prices.length < 200) {
        // Return default/neutral if not enough data
        return {
            sma50: 0,
            sma200: 0,
            rsi: 50,
            macd: { value: 0, signal: 0, histogram: 0 },
            volumeAvg: 0,
            volumeCurrent: 0,
            technicalScore: 50
        };
    }

    const currentPrice = prices[prices.length - 1];

    // 1. SMA 50
    const slice50 = prices.slice(-50);
    const sma50 = slice50.reduce((a, b) => a + b, 0) / 50;

    // 2. SMA 200
    const slice200 = prices.slice(-200);
    const sma200 = slice200.reduce((a, b) => a + b, 0) / 200;

    // 3. RSI 14
    // Simplified calculation for demo
    const rsi = calculateRSI(prices, 14);

    // 4. MACD (12, 26, 9)
    // Simplified mock values as full MACD algo is complex
    // In real app, use technicalindicators library
    const macdValue = currentPrice * 0.02; // Mock
    const macdSignal = currentPrice * 0.018; // Mock

    // 5. Volume (Mock)
    const volumeAvg = 1000000;
    const volumeCurrent = 1200000;

    // 6. Score
    let score = 50;
    if (currentPrice > sma50) score += 10;
    if (currentPrice > sma200) score += 20;
    if (rsi > 30 && rsi < 70) score += 10; // Healthy range
    if (rsi < 30) score += 20; // Oversold (buy signal)

    return {
        sma50,
        sma200,
        rsi,
        macd: {
            value: macdValue,
            signal: macdSignal,
            histogram: macdValue - macdSignal
        },
        volumeAvg,
        volumeCurrent,
        technicalScore: Math.min(score, 100)
    };
}

function calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
    }

    if (losses === 0) return 100;

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;

    return 100 - (100 / (1 + rs));
}
