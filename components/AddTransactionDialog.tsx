"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Loader2, Clipboard, Check } from "lucide-react";
import { performOCR } from "@/lib/ocrUtils";

export function AddTransactionDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("expense");
    const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

    const handleOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setStatus("processing");

        try {
            const result = await performOCR(file);
            setDescription(result.merchant || "");
            setAmount(result.amount?.toString() || "");
            setCategory(result.suggestedCategory || "");
            setStatus("success");
            setTimeout(() => setStatus("idle"), 2000);
        } catch (error) {
            console.error("OCR failed", error);
            setStatus("idle");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaste = async () => {
        // Simplified paste simulation for OCR
        setIsLoading(true);
        setStatus("processing");
        setTimeout(() => {
            setDescription("Starbucks Coffee");
            setAmount("5.50");
            setCategory("Dining");
            setIsLoading(false);
            setStatus("success");
            setTimeout(() => setStatus("idle"), 2000);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Enter details manually or upload a receipt to use OCR.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            className="relative overflow-hidden group h-20 flex-col gap-2 border-dashed"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                            <span className="text-xs">Upload Receipt</span>
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleOCR}
                                accept="image/*"
                            />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col gap-2 border-dashed"
                            onClick={handlePaste}
                            disabled={isLoading}
                        >
                            {status === "success" ? <Check className="h-6 w-6 text-green-500" /> : <Clipboard className="h-6 w-6" />}
                            <span className="text-xs">Paste Image</span>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-xs">Description</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right text-xs">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right text-xs">Category</Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="col-span-3 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right text-xs">Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="col-span-3 h-8">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="expense">Expense</SelectItem>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="investment">Investment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => setOpen(false)}>Save Transaction</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
