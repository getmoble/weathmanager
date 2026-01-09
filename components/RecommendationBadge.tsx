"use client";


interface RecommendationBadgeProps {
    recommendation: 'buy' | 'sell' | 'hold';
}

export function RecommendationBadge({ recommendation }: RecommendationBadgeProps) {
    const styles = {
        buy: "bg-green-500/10 text-green-500 border-green-500/20",
        sell: "bg-red-500/10 text-red-500 border-red-500/20",
        hold: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[recommendation]}`}>
            {recommendation}
        </span>
    );
}
