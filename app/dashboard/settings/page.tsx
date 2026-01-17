"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Building2, Wallet, Layers, Trash2, Edit2, CheckCircle2, AlertCircle, TrendingUp, CreditCard, Target, Landmark, Coins, Car, Settings as SettingsIcon } from "lucide-react";
import { DataService } from "@/lib/dataService";
import { createGoal, updateGoal, deleteGoal, createAsset, updateAsset, deleteAsset, createBank, updateBank, deleteBank, createBroker, updateBroker, deleteBroker, createCategory, deleteCategory } from "@/lib/actions";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your financial ecosystem.</p>
            </div>

            <Tabs defaultValue="goals" className="flex flex-col md:flex-row gap-0 border rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                <TabsList className="flex flex-col h-auto bg-slate-50/50 dark:bg-zinc-900/50 border-r rounded-none p-1 items-start space-y-0 w-full md:w-48 shrink-0">
                    <TabsTrigger value="goals" className="w-full justify-start gap-2 h-9">Goals</TabsTrigger>
                    <TabsTrigger value="assets" className="w-full justify-start gap-2 h-9">Assets</TabsTrigger>
                    <TabsTrigger value="liabilities" className="w-full justify-start gap-2 h-9">Liabilities</TabsTrigger>
                    <TabsTrigger value="asset-categories" className="w-full justify-start gap-2 h-9">Asset Categories</TabsTrigger>
                    <TabsTrigger value="liability-categories" className="w-full justify-start gap-2 h-9">Liability Categories</TabsTrigger>
                    <TabsTrigger value="income-categories" className="w-full justify-start gap-2 h-9">Income Categories</TabsTrigger>
                    <TabsTrigger value="expense-categories" className="w-full justify-start gap-2 h-9">Expense Categories</TabsTrigger>
                    <TabsTrigger value="brokers" className="w-full justify-start gap-2 h-9">Brokers</TabsTrigger>
                    <TabsTrigger value="banks" className="w-full justify-start gap-2 h-9">Banks</TabsTrigger>
                </TabsList>

                <div className="flex-1 p-6 bg-white dark:bg-zinc-950 overflow-y-auto">
                    <TabsContent value="goals" className="mt-0"> <GoalManagement /> </TabsContent>
                    <TabsContent value="assets" className="mt-0"> <AssetManagement /> </TabsContent>
                    <TabsContent value="liabilities" className="mt-0"> <LiabilityManagement /> </TabsContent>
                    <TabsContent value="asset-categories" className="mt-0"> <CategoryManagement type="asset" label="Asset Categories" icon={Landmark} /> </TabsContent>
                    <TabsContent value="liability-categories" className="mt-0"> <CategoryManagement type="liability" label="Liability Categories" icon={CreditCard} /> </TabsContent>
                    <TabsContent value="income-categories" className="mt-0"> <CategoryManagement type="income" label="Income Categories" icon={TrendingUp} /> </TabsContent>
                    <TabsContent value="expense-categories" className="mt-0"> <CategoryManagement type="expense" label="Expense Categories" icon={CreditCard} /> </TabsContent>
                    <TabsContent value="brokers" className="mt-0"> <BrokerManagement /> </TabsContent>
                    <TabsContent value="banks" className="mt-0"> <BankManagement /> </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

// --- GOALS ---
function GoalManagement() {
    const [goals, setGoals] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const router = useRouter();

    const refresh = async () => {
        const data = await DataService.getGoals();
        setGoals(data);
        router.refresh();
    };

    useEffect(() => { refresh(); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            targetAmount: Number(formData.get('targetAmount')),
            currentAmount: Number(formData.get('currentAmount')),
            targetYear: Number(formData.get('targetYear')),
            monthlyContribution: Number(formData.get('monthlyContribution')),
            status: 'todo', // Default
            category: 'General' // Default for now
        };

        if (editing) {
            await updateGoal(editing.id, { ...data, status: editing.status });
        } else {
            await createGoal(data);
        }
        setIsOpen(false);
        setEditing(null);
        refresh();
    };

    const handleDelete = async (id: string) => {
        // if (confirm('Delete this goal?')) {
        await deleteGoal(id);
        refresh();
        // }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Financial Goals</h2>
                <Button onClick={() => { setEditing(null); setIsOpen(true); }} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Goal</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                    <Card key={goal.id} className="relative overflow-hidden border-primary/20">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{goal.name}</CardTitle>
                                <Badge variant={goal.status === 'achieved' ? 'default' : 'secondary'}>{goal.status}</Badge>
                            </div>
                            <CardDescription>Target: {goal.targetYear}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Saved</span>
                                <span className="font-semibold text-emerald-500">₹{goal.currentAmount?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Target</span>
                                <span className="font-semibold">₹{goal.targetAmount?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-2 bg-muted/30">
                            <Button variant="ghost" size="sm" onClick={() => { setEditing(goal); setIsOpen(true); }}><Edit2 className="h-3 w-3 mr-1" /> Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(goal.id)}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Goal' : 'New Goal'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Goal Name</Label>
                            <Input name="name" defaultValue={editing?.name} required placeholder="e.g. Retirement" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Input name="description" defaultValue={editing?.description} placeholder="Optional details" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Target Amount (₹)</Label>
                                <Input name="targetAmount" type="number" defaultValue={editing?.targetAmount} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Current Amount (₹)</Label>
                                <Input name="currentAmount" type="number" defaultValue={editing?.currentAmount || 0} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Target Year</Label>
                                <Input name="targetYear" type="number" defaultValue={editing?.targetYear || new Date().getFullYear() + 1} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Monthly Sip (₹)</Label>
                                <Input name="monthlyContribution" type="number" defaultValue={editing?.monthlyContribution || 0} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- ASSETS ---
function AssetManagement() {
    const [assets, setAssets] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const router = useRouter();

    const refresh = async () => {
        const data = await DataService.getAssets();
        setAssets(data);
        router.refresh();
    };

    useEffect(() => { refresh(); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            type: formData.get('type'),
            currentValue: Number(formData.get('currentValue')),
            purchaseValue: Number(formData.get('purchaseValue')),
            purchaseDate: formData.get('purchaseDate') as string, // keep string for text input or date picker
            location: formData.get('location'),
            notes: formData.get('notes'),
        };

        if (editing) {
            await updateAsset(editing.id, data);
        } else {
            await createAsset(data);
        }
        setIsOpen(false);
        setEditing(null);
        refresh();
    };

    const handleDelete = async (id: string) => {
        // if (confirm('Delete this asset?')) {
        await deleteAsset(id);
        refresh();
        // }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Physical & Digital Assets</h2>
                <Button onClick={() => { setEditing(null); setIsOpen(true); }} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Asset</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assets.map((asset) => (
                    <Card key={asset.id} className="relative border-primary/20">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{asset.name}</CardTitle>
                                <Badge variant="outline">{asset.type}</Badge>
                            </div>
                            <CardDescription>{asset.location || 'N/A'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-500">₹{asset.currentValue?.toLocaleString('en-IN')}</div>
                            <div className="text-xs text-muted-foreground">Bought for ₹{asset.purchaseValue?.toLocaleString('en-IN')}</div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-2 bg-muted/30">
                            <Button variant="ghost" size="sm" onClick={() => { setEditing(asset); setIsOpen(true); }}><Edit2 className="h-3 w-3 mr-1" /> Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(asset.id)}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? 'Edit Asset' : 'New Asset'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Asset Name</Label>
                            <Input name="name" defaultValue={editing?.name} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Input name="type" defaultValue={editing?.type || 'Real Estate'} placeholder="e.g. Gold, Real Estate" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Current Value (₹)</Label>
                                <Input name="currentValue" type="number" defaultValue={editing?.currentValue} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Purchase Value (₹)</Label>
                                <Input name="purchaseValue" type="number" defaultValue={editing?.purchaseValue} required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Purchase Date</Label>
                            <Input name="purchaseDate" type="date" defaultValue={editing?.purchaseDate} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Location</Label>
                            <Input name="location" defaultValue={editing?.location} />
                        </div>
                        <DialogFooter><Button type="submit">{editing ? 'Update' : 'Create'}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- LIABILITIES ---
function LiabilityManagement() {
    const [liabilities, setLiabilities] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const router = useRouter();

    const refresh = async () => {
        const data = await DataService.getLiabilities();
        setLiabilities(data);
        router.refresh();
    };

    useEffect(() => { refresh(); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            totalAmount: Number(formData.get('totalAmount')),
            outstandingAmount: Number(formData.get('outstandingAmount')),
            interestRate: Number(formData.get('interestRate')),
            emi: Number(formData.get('emi')) || undefined,
            startDate: formData.get('startDate') as string,
            endDate: (formData.get('endDate') as string) || undefined,
            notes: (formData.get('notes') as string) || undefined,
        };

        if (editing) {
            await DataService.updateLiability(editing.id, data);
        } else {
            await DataService.addLiability(data as any);
        }
        setIsOpen(false);
        setEditing(null);
        refresh();
    };

    const handleDelete = async (id: string) => {
        await DataService.deleteLiability(id);
        refresh();
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Liabilities & Debts</h2>
                <Button onClick={() => { setEditing(null); setIsOpen(true); }} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Liability</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {liabilities.map((l) => (
                    <Card key={l.id} className="relative border-rose-500/20">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{l.name}</CardTitle>
                                <Badge variant="outline" className="border-rose-200 text-rose-700 bg-rose-50">{l.type}</Badge>
                            </div>
                            <CardDescription>{l.interestRate}% Interest</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600">₹{l.outstandingAmount?.toLocaleString('en-IN')}</div>
                            <div className="text-xs text-muted-foreground">Original: ₹{l.totalAmount?.toLocaleString('en-IN')}</div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-2 bg-muted/30">
                            <Button variant="ghost" size="sm" onClick={() => { setEditing(l); setIsOpen(true); }}><Edit2 className="h-3 w-3 mr-1" /> Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(l.id)}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? 'Edit Liability' : 'New Liability'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Liability Name</Label>
                            <Input name="name" defaultValue={editing?.name} required placeholder="e.g. Home Loan" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Input name="type" defaultValue={editing?.type || 'Home Loan'} placeholder="e.g. Credit Card, Personal Loan" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Total Amount (₹)</Label>
                                <Input name="totalAmount" type="number" defaultValue={editing?.totalAmount} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Outstanding (₹)</Label>
                                <Input name="outstandingAmount" type="number" defaultValue={editing?.outstandingAmount} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Interest Rate (%)</Label>
                                <Input name="interestRate" type="number" step="0.01" defaultValue={editing?.interestRate} required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Input name="startDate" type="date" defaultValue={editing?.startDate} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>EMI (Monthly Payment ₹)</Label>
                                <Input name="emi" type="number" defaultValue={editing?.emi} placeholder="Optional" />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date (Optional)</Label>
                                <Input name="endDate" type="date" defaultValue={editing?.endDate} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Input name="notes" defaultValue={editing?.notes} />
                        </div>
                        <DialogFooter><Button type="submit">{editing ? 'Update' : 'Create'}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- BANKS ---
function BankManagement() {
    const [banks, setBanks] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const router = useRouter();

    const refresh = async () => {
        const data = await DataService.getBanks();
        setBanks(data);
        router.refresh();
    };

    useEffect(() => { refresh(); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            type: formData.get('type'),
            last4: formData.get('last4'),
            balance: Number(formData.get('balance')),
            primary: Boolean(formData.get('primary')),
        };

        if (editing) {
            await updateBank(editing.id, data);
        } else {
            await createBank(data);
        }
        setIsOpen(false);
        setEditing(null);
        refresh();
    };

    const handleDelete = async (id: number) => {
        // if (confirm('Disconnect this bank?')) {
        await deleteBank(id);
        refresh();
        // }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Bank Accounts</h2>
                <Button onClick={() => { setEditing(null); setIsOpen(true); }} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Bank</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {banks.map((bank) => (
                    <Card key={bank.id}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{bank.name}</CardTitle>
                                {bank.primary && <Badge variant="secondary">Primary</Badge>}
                            </div>
                            <CardDescription>{bank.type} •••• {bank.last4}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{bank.balance?.toLocaleString('en-IN')}</div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-2">
                            <Button variant="ghost" size="sm" onClick={() => { setEditing(bank); setIsOpen(true); }}><Edit2 className="h-3 w-3 mr-1" /> Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(bank.id)}><Trash2 className="h-3 w-3 mr-1" /> Remove</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? 'Edit Bank' : 'Link Bank'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Bank Name</Label>
                            <Input name="name" defaultValue={editing?.name} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Select name="type" defaultValue={editing?.type || 'Savings'}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Savings">Savings</SelectItem>
                                    <SelectItem value="Current">Current</SelectItem>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Last 4 Digits</Label>
                            <Input name="last4" maxLength={4} defaultValue={editing?.last4} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Current Balance</Label>
                            <Input name="balance" type="number" defaultValue={editing?.balance} required />
                        </div>
                        <DialogFooter><Button type="submit">{editing ? 'Update' : 'Link'}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- BROKERS ---
function BrokerManagement() {
    const [brokers, setBrokers] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const router = useRouter();

    const refresh = async () => {
        const data = await DataService.getBrokers();
        setBrokers(data);
        router.refresh();
    };

    useEffect(() => { refresh(); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            status: 'connected', // Default to connected
            lastSync: 'Just now',
            syncEnabled: true
        };
        // We only support adding brokers name for now in this UI
        if (editing) {
            await updateBroker(editing.id, data);
        } else {
            await createBroker(data);
        }
        setIsOpen(false);
        setEditing(null);
        refresh();
    };

    const handleDelete = async (id: number) => {
        // if (confirm('Unlink this broker?')) {
        await deleteBroker(id);
        refresh();
        // }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Connected Brokers</h2>
                <Button onClick={() => { setEditing(null); setIsOpen(true); }} size="sm"><Plus className="h-4 w-4 mr-2" /> Link Broker</Button>
            </div>
            <div className="space-y-4">
                {brokers.map((broker) => (
                    <div key={broker.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-md flex items-center justify-center font-bold text-white bg-blue-600`}>{broker.name[0]}</div>
                            <div>
                                <h4 className="font-semibold">{broker.name}</h4>
                                <div className="text-xs text-muted-foreground">{broker.status} • {broker.lastSync}</div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(broker.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Link Broker</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Broker Name</Label>
                            <Select name="name" defaultValue="Zerodha">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Zerodha">Zerodha</SelectItem>
                                    <SelectItem value="Groww">Groww</SelectItem>
                                    <SelectItem value="Upstox">Upstox</SelectItem>
                                    <SelectItem value="Angel One">Angel One</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter><Button type="submit">Link Account</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}


// --- CATEGORIES (Generic) ---
function CategoryManagement({ type, label, icon: Icon }: { type: string, label: string, icon: any }) {
    const [categories, setCategories] = useState<string[]>([]);
    const [newCat, setNewCat] = useState("");
    const router = useRouter();

    const refresh = async () => {
        const data = await DataService.getCategories();
        // @ts-ignore
        setCategories(data[type === 'asset-categories' ? 'assets' : type === 'income-categories' ? 'income' : type === 'income' ? 'income' : type === 'expense' ? 'expense' : 'assets'] || []);
    };
    // Fix type mapping logic: 'assets' comes from 'asset-categories' tab but type prop passed is 'asset' usually
    // Let's verify usage: <CategoryManagement type="asset" ... />. DataService returns { income, expense, assets }.
    // So key is 'assets' if type is 'asset'.

    const refreshCorrect = async () => {
        const data = await DataService.getCategories();
        const key = type === 'asset' ? 'assets' : type;
        // @ts-ignore
        setCategories(data[key] || []);
    }

    useEffect(() => { refreshCorrect(); }, [type]);

    const handleAdd = async () => {
        if (!newCat) return;
        await createCategory(newCat, type);
        setNewCat("");
        refreshCorrect();
    };

    const handleDelete = async (name: string) => {
        // if (confirm(`Delete category ${name}?`)) {
        await deleteCategory(name, type);
        refreshCorrect();
        // }
    }

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {label}
                </CardTitle>
                <CardDescription>Manage your {type} categories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
                {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between group py-1 px-2 hover:bg-muted/50 rounded-md transition-colors">
                        <span className="text-sm">{cat}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(cat)}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
                <div className="pt-3 flex gap-2">
                    <Input
                        placeholder="New category..."
                        className="h-8 text-xs"
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <Button size="sm" className="h-8 px-3" onClick={handleAdd}>Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}
