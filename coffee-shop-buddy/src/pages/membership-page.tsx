import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { User, Wallet, ShoppingBag, CreditCard } from 'lucide-react';

const mockUser = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  memberSince: '2023-01-15',
  balance: 75.50,
};

const mockOrderHistory = [
  { id: 'ORD-001', date: '2024-07-15', total: 12.50, status: 'Completed' },
  { id: 'ORD-002', date: '2024-07-10', total: 25.00, status: 'Completed' },
  { id: 'ORD-003', date: '2024-06-28', total: 8.75, status: 'Completed' },
];

type MembershipTab = 'profile' | 'balance' | 'history';

export function MembershipPage() {
  const [activeTab, setActiveTab] = useState<MembershipTab>('profile');
  const { toast } = useToast();

  const handleTopUp = (amount: number) => {
    toast({
      title: "Top-up Successful!",
      description: `$${amount.toFixed(2)} has been added to your balance.`,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'balance':
        return <BalanceSection onTopUp={handleTopUp} />;
      case 'history':
        return <OrderHistorySection />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-coffee-brown">Membership</h1>
        <p className="text-lg text-coffee-brown/80 mt-2">Your personal coffee hub.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-2 sticky top-24">
            <Button variant={activeTab === 'profile' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('profile')} className="justify-start gap-2">
              <User className="h-4 w-4" /> Profile
            </Button>
            <Button variant={activeTab === 'balance' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('balance')} className="justify-start gap-2">
              <Wallet className="h-4 w-4" /> Balance & Top-up
            </Button>
            <Button variant={activeTab === 'history' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('history')} className="justify-start gap-2">
              <ShoppingBag className="h-4 w-4" /> Order History
            </Button>
          </nav>
        </aside>
        <main className="md:col-span-3">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" defaultValue={mockUser.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue={mockUser.email} />
        </div>
        <p className="text-sm text-muted-foreground">Member since: {mockUser.memberSince}</p>
      </CardContent>
      <CardFooter>
        <Button className="bg-sage-green text-coffee-brown hover:bg-sage-green/90">Save Changes</Button>
      </CardFooter>
    </Card>
  );
}

function BalanceSection({ onTopUp }: { onTopUp: (amount: number) => void }) {
  const [customAmount, setCustomAmount] = useState('');
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-coffee-brown">${mockUser.balance.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top-up Your Balance</CardTitle>
          <CardDescription>Add funds to your account for faster checkout.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {[20, 50, 100].map(amount => (
              <Button key={amount} variant="outline" onClick={() => onTopUp(amount)}>
                ${amount}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Input 
              placeholder="Custom amount" 
              type="number" 
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
            <Button 
              className="bg-sage-green text-coffee-brown hover:bg-sage-green/90" 
              onClick={() => {
                const amount = parseFloat(customAmount);
                if (amount > 0) {
                  onTopUp(amount);
                  setCustomAmount('');
                }
              }}
              disabled={!customAmount || parseFloat(customAmount) <= 0}
            >
              <CreditCard className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderHistorySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>Review your past purchases.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrderHistory.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}