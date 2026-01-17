export const ASSET_GROWTH_RATES: Record<string, number> = {
    "Real Estate": 0.08,    // 8% annual growth
    "Gold": 0.06,           // 6% annual growth
    "Vehicle": -0.15,       // -15% annual growth (depreciation)
    "Crypto": 0.25,         // 25% annual growth
    "Fixed Deposit": 0.07,  // 7% annual growth
    "Courses": 0.0,          // 0% (education usually isn't a financial asset that "grows" in value directly, but we can set it to 0)
    "default": 0.05         // 5% default
};
