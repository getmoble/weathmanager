"use client"
import { useState } from 'react'
import { useAuth } from '@/components/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Lock, User as UserIcon } from 'lucide-react'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (login(username, password)) {
            // Success handled by context redirect
        } else {
            setError('Invalid credentials (try admin/admin)')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-4">
                <Card className="border-border/50 bg-card/95 backdrop-blur shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold tracking-tight text-primary">Wealth Manager</CardTitle>
                        <CardDescription>Enter your credentials to access your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        placeholder="Enter username"
                                        className="pl-10"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
                            <Button type="submit" className="w-full font-bold">Sign In</Button>
                        </form>
                    </CardContent>
                    <CardFooter className="text-center text-sm text-muted-foreground">
                        Protected Secure Area
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
