"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkles, Upload, Clipboard, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { performOCR } from "@/lib/ocrUtils";
import { OCRResult } from "@/types/types";

interface AnalyzedTransaction extends Partial<OCRResult> {
    id: string;
}

export function SmartOCRModal() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AnalyzedTransaction[]>([]);

    const handleOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const result = await performOCR(file);
            // For demo, we might extract one or simulate multiple
            setResults([{
                id: Math.random().toString(),
                merchant: result.merchant,
                amount: result.amount,
                suggestedCategory: result.suggestedCategory,
                date: result.date
            }]);
            setStep(2);
        } catch (error) {
            console.error("OCR failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const simulatePasteAnalysis = () => {
        setIsLoading(true);
        setTimeout(() => {
            setResults([
                { id: '1', merchant: "Starbucks", amount: 450, suggestedCategory: "Dining", date: new Date().toISOString() },
                { id: '2', merchant: "Amazon India", amount: 2499, suggestedCategory: "Shopping", date: new Date().toISOString() },
                { id: '3', merchant: "Uber", amount: 320, suggestedCategory: "Transport", date: new Date().toISOString() },
            ]);
            setStep(2);
            setIsLoading(false);
        }, 2000);
    };

    const updateResult = (id: string, field: keyof AnalyzedTransaction, value: any) => {
        setResults(results.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const removeResult = (id: string) => {
        setResults(results.filter(r => r.id !== id));
    };

    const handleFinalSubmit = () => {
        console.log("Submitting analyzed transactions:", results);
        setOpen(false);
        setStep(1);
        setResults([]);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setStep(1); }}>
            <DialogTrigger asChild>
                <Button variant="default" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Sparkles className="h-4 w-4" /> Smart Scan
                </Button>
            </DialogTrigger>
            <DialogContent className={step === 1 ? "sm:max-w-[425px]" : "sm:max-w-[800px] max-h-[90vh] flex flex-col"}>
                <DialogHeader>
                    <DialogTitle>{step === 1 ? "Smart Screenshot Analysis" : "Review Analyzed Transactions"}</DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? "Paste or upload a screenshot of your bank statement, UPI apps, or receipts."
                            : "Review and edit the transactions detected by our AI before saving."}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 ? (
                    <div className="grid grid-cols-2 gap-4 py-8">
                        <Button
                            variant="outline"
                            className="relative h-32 flex-col gap-3 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8 text-primary" />}
                            <div className="text-center">
                                <p className="text-sm font-semibold">Upload Image</p>
                                <p className="text-[10px] text-muted-foreground">PNG, JPG up to 10MB</p>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleOCR} accept="image/*" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-32 flex-col gap-3 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                            onClick={simulatePasteAnalysis}
                            disabled={isLoading}
                        >
                            <Clipboard className="h-8 w-8 text-primary" />
                            <div className="text-center">
                                <p className="text-sm font-semibold">Paste Screenshot</p>
                                <p className="text-[10px] text-muted-foreground">Ctrl+V to analyze</p>
                            </div>
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto py-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Merchant/Description</TableHead>
                                    <TableHead className="w-[120px]">Amount</TableHead>
                                    <TableHead className="w-[150px]">Category</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((res) => (
                                    <TableRow key={res.id}>
                                        <TableCell>
                                            <Input
                                                value={res.merchant || ""}
                                                onChange={(e) => updateResult(res.id, 'merchant', e.target.value)}
                                                className="h-8"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={res.amount || ""}
                                                onChange={(e) => updateResult(res.id, 'amount', parseFloat(e.target.value))}
                                                className="h-8"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={res.suggestedCategory || ""}
                                                onChange={(e) => updateResult(res.id, 'suggestedCategory', e.target.value)}
                                                className="h-8"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => removeResult(res.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {results.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground italic">
                                No transactions detected.
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={handleFinalSubmit} className="gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Save {results.length} Transactions
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
