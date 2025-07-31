import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const partySizeOptions = [2, 3, 4, 5, 6, 7, 8];
const timeOptions = [
  "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM"
];

export function ReservationPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string | undefined>();
  const [partySize, setPartySize] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !partySize || !name || !email) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields to make a reservation.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Reservation Successful!",
      description: `Thank you, ${name}! Your table for ${partySize} on ${format(date, 'PPP')} at ${time} is confirmed.`,
    });

    // Reset form
    setDate(new Date());
    setTime(undefined);
    setPartySize(undefined);
    setName('');
    setEmail('');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-coffee-brown">Book a Table</h1>
        <p className="text-lg text-coffee-brown/80 mt-2">Reserve your spot at our cozy café.</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-coffee-brown">Reservation Details</CardTitle>
            <CardDescription>Select a date, time, and party size.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Party Size</Label>
                  <Select value={partySize} onValueChange={setPartySize}>
                    <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>
                      {partySizeOptions.map(size => (
                        <SelectItem key={size} value={String(size)}>{size} people</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-sage-green text-coffee-brown hover:bg-sage-green/90">
                Confirm Reservation
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="flex justify-center">
           <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
          />
        </div>
      </div>
    </div>
  );
}