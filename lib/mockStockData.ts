import { Stock } from '@/types/types';
import { DataService } from './dataService';

export async function getStocks(): Promise<Stock[]> {
    return DataService.getStocks();
}

export async function getStock(ticker: string): Promise<Stock | undefined> {
    const stocks = await DataService.getStocks();
    return stocks.find(s => s.ticker === ticker);
}

export const getStockByTicker = getStock;

