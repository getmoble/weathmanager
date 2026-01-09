import { OCRResult } from '@/types/types';
import Tesseract from 'tesseract.js';

export async function processReceiptImage(imageFile: File): Promise<OCRResult> {
    const worker = await Tesseract.createWorker('eng');

    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();

    // Indian receipt patterns (looking for GST, Rupees etc)
    const amountMatch = text.match(/Total[\s\S]*?(?:Rs|₹|\.|\|)?\s*(\d+\.\d{2})/i) ||
        text.match(/Net Amount[\s\S]*?(\d+\.\d{2})/i) ||
        text.match(/(\d+\.\d{2})/);

    const dateMatch = text.match(/(\d{2}[-/]\d{2}[-/]\d{4})/);

    return {
        amount: amountMatch ? parseFloat(amountMatch[1]) : null,
        date: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
        merchant: text.split('\n')[0] || "Unknown Merchant",
        suggestedCategory: inferCategory(text),
        confidence: 0.8,
        rawText: text
    };
}

function inferCategory(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('zomato') || lower.includes('swiggy') || lower.includes('restaurant')) return 'Food & Dining';
    if (lower.includes('reliance') || lower.includes('dmart') || lower.includes('bazaar')) return 'Shopping';
    if (lower.includes('uber') || lower.includes('ola') || lower.includes('petrol')) return 'Transport';
    if (lower.includes('lic') || lower.includes('hdfc life')) return 'Insurance';
    return 'General';
}

export const performOCR = processReceiptImage;
