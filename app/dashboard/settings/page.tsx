"use client";

import { DataService } from "@/lib/dataService";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Building2, Wallet, Layers, Link2, Trash2, Edit2, CheckCircle2, AlertCircle, TrendingUp, CreditCard, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your bank accounts, categories, and broker connections.</p>
            </div>

            <Tabs defaultValue="banks" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="banks" className="gap-2">
                        <Building2 className="h-4 w-4" /> Banks
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="gap-2">
                        <Layers className="h-4 w-4" /> Categories
                    </TabsTrigger>
                    <TabsTrigger value="brokers" className="gap-2">
                        <Link2 className="h-4 w-4" /> Brokers
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="banks" className="space-y-4">
                    <BankManagement />
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <CategoryManagement />
                </TabsContent>

                <TabsContent value="brokers" className="space-y-4">
                    <BrokerManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function BankManagement() {
    const [banks, setBanks] = useState<any[]>([]);

    useEffect(() => {
        DataService.getBanks().then(setBanks);
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {banks.map((bank) => (
                <Card key={bank.id} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{bank.name}</CardTitle>
                            {bank.primary && <Badge variant="secondary">Primary</Badge>}
                        </div>
                        <CardDescription>{bank.type} • •••• {bank.last4}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹ {bank.balance.toLocaleString('en-IN')}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-3">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Edit2 className="h-3 w-3" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3" /> Remove
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            <Card className="border-dashed flex items-center justify-center py-10 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Plus className="h-8 w-8" />
                    <span className="font-medium">Link New Bank</span>
                </div>
            </Card>
        </div>
    );
}

function CategoryManagement() {
    const [categories, setCategories] = useState<{ income: string[], expense: string[] }>({ income: [], expense: [] });

    useEffect(() => {
        DataService.getCategories().then(setCategories);
    }, []);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        Income Categories
                    </CardTitle>
                    <CardDescription>Categories for categorizing your inflows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {categories.income.map(cat => (
                        <div key={cat} className="flex items-center justify-between group">
                            <span className="text-sm">{cat}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2 flex gap-2">
                        <Input placeholder="New category name" className="h-8 text-xs" />
                        <Button size="sm" className="h-8 px-3">Add</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-rose-500" />
                        Expense Categories
                    </CardTitle>
                    <CardDescription>Categories for tracking your outflows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {categories.expense.map(cat => (
                        <div key={cat} className="flex items-center justify-between group">
                            <span className="text-sm">{cat}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2 flex gap-2">
                        <Input placeholder="New category name" className="h-8 text-xs" />
                        <Button size="sm" className="h-8 px-3">Add</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function BrokerManagement() {
    const [brokers, setBrokers] = useState<any[]>([]);

    useEffect(() => {
        DataService.getBrokers().then(setBrokers);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connected Brokers</CardTitle>
                <CardDescription>Link your brokerage accounts to automatically track your investments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {brokers.map((broker) => (
                        <div key={broker.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center font-bold text-white ${broker.name === 'Zerodha' ? 'bg-blue-600' :
                                    broker.name === 'Upstox' ? 'bg-purple-600' : 'bg-orange-500'
                                    }`}>
                                    {broker.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{broker.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        {broker.status === 'connected' ? (
                                            <Badge variant="outline" className="text-emerald-500 border-emerald-500 bg-emerald-500/10 gap-1 h-5">
                                                <CheckCircle2 className="h-3 w-3" /> Connected
                                            </Badge>
                                        ) : broker.status === 'disconnected' ? (
                                            <Badge variant="outline" className="text-amber-500 border-amber-500 bg-amber-500/10 gap-1 h-5">
                                                <AlertCircle className="h-3 w-3" /> Reconnection Required
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground gap-1 h-5">
                                                Not Linked
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">Last sync: {broker.lastSync}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {broker.status === 'not_linked' ? (
                                    <Button size="sm">Link Account</Button>
                                ) : (
                                    <>
                                        <Button variant="outline" size="sm">Sync Now</Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><SettingsIcon className="h-4 w-4" /></Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


