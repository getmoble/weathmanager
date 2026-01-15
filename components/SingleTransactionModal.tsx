"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface SingleTransactionModalProps {
  type?: 'income' | 'expense' | 'investment';
  trigger?: React.ReactNode;
  transactionToEdit?: any; // Using any for partial Transaction to avoid strict type issues for now, or use Transaction
  onClose?: () => void;
  onSave?: () => void;
}

import { Transaction } from "@/types/types";
import { DataService } from "@/lib/dataService";
import { useEffect } from "react";

export function SingleTransactionModal({ type: initialType = 'expense', trigger, transactionToEdit, onClose, onSave }: SingleTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [type, setType] = useState(initialType);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await DataService.getCategories();
        // Flatten or select specific type based on 'type' state if needed, but spec says "expense category management",
        // usually we want expense categories for expense type.
        // Let's filter based on current `type` state if possible, or just load all suitable for the type.
        if (type === 'income') setCategories(data.income);
        else if (type === 'expense') setCategories(data.expense);
        else if (type === 'investment') setCategories(data.assets); // Investment usually links to assets or specific logic
        else setCategories([...data.expense, ...data.income]);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    loadCategories();
  }, [type]);

  // Effect to handle open state if controlled externally (optional) or just use internal state
  // But more importantly, populate form when opening in edit mode
  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount.toString());
      setCategory(transactionToEdit.category);
      setType(transactionToEdit.type);
      setDate(transactionToEdit.date.split('T')[0]); // Assume ISO string
      setOpen(true);
    }
  }, [transactionToEdit]);


  const handleSave = async () => {
    try {
      const payload = {
        description,
        amount: parseFloat(amount),
        category,
        type,
        date: new Date(date).toISOString(),
        isRecurring: false,
        acknowledged: true
      };

      if (transactionToEdit) {
        await DataService.updateTransaction(transactionToEdit.id, payload);
      } else {
        await DataService.addTransaction(payload as any);
      }

      setOpen(false);
      // Reset form
      setDescription("");
      setAmount("");
      setCategory("");
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to save transaction", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) onClose();
  }


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Single
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transactionToEdit ? 'Edit Transaction' : 'Add Single Transaction'}</DialogTitle>
          <DialogDescription>
            {transactionToEdit ? 'Update details of this transaction.' : 'Enter the details for a single financial activity.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Salary, Groceries"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₹ 0.00"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger className="col-span-3">
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
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
