import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { fetchMemberData, processTopUp } from '@/lib/api';
import { User, Wallet, ShoppingBag, CreditCard } from 'lucide-react';

type MemberData = {
  name: string;
  balance: number;
  memberSince: string;
  orderHistory: { id: string; date: string; items: string; total: number }[];
};

type MembershipTab = 'profile' | 'balance' | 'history';

export function MembershipPage() {
  const [activeTab, setActiveTab] = useState<MembershipTab>('profile');
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMemberData = async () => {
    try {
      setLoading(true);
      const data = await fetchMemberData();
      setMemberData(data);
    } catch (error) {
      console.error("Failed to fetch member data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">Loading your membership details...</div>;
    }
    if (!memberData) {
      return <div className="text-center py-8 text-red-500">Could not load member data.</div>;
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileSection user={memberData} />;
      case 'balance':
        return <BalanceSection balance={memberData.balance} onSuccessfulTopUp={loadMemberData} />;
      case 'history':
        return <OrderHistorySection history={memberData.orderHistory} />;
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

function ProfileSection({ user }: { user: { name: string; memberSince: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" defaultValue={user.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue={`${user.name.toLowerCase().replace(' ', '.')}@example.com`} />
        </div>
        <p className="text-sm text-muted-foreground">Member since: {user.memberSince}</p>
      </CardContent>
      <CardFooter>
        <Button className="bg-sage-green text-coffee-brown hover:bg-sage-green/90">Save Changes</Button>
      </CardFooter>
    </Card>
  );
}

function BalanceSection({ balance, onSuccessfulTopUp }: { balance: number; onSuccessfulTopUp: () => void }) {
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTopUp = async (amount: number) => {
    setIsSubmitting(true);
    try {
      const result = await processTopUp(amount);
      if (result.success) {
        toast({
          title: "Top-up Successful!",
          description: `$${amount.toFixed(2)} has been added. Your new balance is $${result.newBalance?.toFixed(2)}.`,
        });
        onSuccessfulTopUp();
        setCustomAmount('');
      } else {
        toast({
          title: "Top-up Failed",
          description: result.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Top-up Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-coffee-brown">${balance.toFixed(2)}</p>
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
              <Button key={amount} variant="outline" onClick={() => handleTopUp(amount)} disabled={isSubmitting}>
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
              disabled={isSubmitting}
            />
            <Button
              className="bg-sage-green text-coffee-brown hover:bg-sage-green/90"
              onClick={() => handleTopUp(parseFloat(customAmount))}
              disabled={isSubmitting || !customAmount || parseFloat(customAmount) <= 0}
            >
              {isSubmitting ? 'Adding...' : <><CreditCard className="h-4 w-4 mr-2" /> Add</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderHistorySection({ history }: { history: { id: string; date: string; items: string; total: number }[] }) {
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
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
