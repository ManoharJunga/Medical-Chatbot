import { CreditCard, Download, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage invoices and transactions</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-4">
        <Card className="xl:col-span-3">
          <CardHeader className="px-6 pt-6 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search transactions..." className="w-full pl-9" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.patient}</TableCell>
                    <TableCell>{transaction.service}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "Paid"
                            ? "default"
                            : transaction.status === "Pending"
                              ? "outline"
                              : "destructive"
                        }
                        className={
                          transaction.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                            : transaction.status === "Pending"
                              ? "text-amber-600"
                              : ""
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Send
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Revenue</span>
                  <span className="font-medium">$8,450.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Outstanding</span>
                  <span className="font-medium text-red-500">$1,220.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processed</span>
                  <span className="font-medium text-emerald-600">$7,230.00</span>
                </div>
              </div>
              <div className="space-y-1 pt-2 border-t">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-sm">Online Consultations</span>
                  <span>$3,200.00</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-sm">In-Person Visits</span>
                  <span>$5,250.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Invoice</CardTitle>
              <CardDescription>Create a new invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="patient-select">
                  Patient
                </label>
                <Select>
                  <SelectTrigger id="patient-select">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jane">Jane Cooper</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="emily">Emily Johnson</SelectItem>
                    <SelectItem value="michael">Michael Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="service-select">
                  Service
                </label>
                <Select>
                  <SelectTrigger id="service-select">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Video Consultation</SelectItem>
                    <SelectItem value="checkup">General Check-up</SelectItem>
                    <SelectItem value="followup">Follow-up Visit</SelectItem>
                    <SelectItem value="specialist">Specialist Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="amount">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">$</span>
                  <Input id="amount" className="pl-7" placeholder="0.00" />
                </div>
              </div>
              <Button className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const transactions = [
  {
    id: 1,
    patient: "Jane Cooper",
    service: "Video Consultation",
    date: "Today, 9:30 AM",
    amount: 75.0,
    status: "Paid",
  },
  {
    id: 2,
    patient: "John Smith",
    service: "In-Person Visit",
    date: "Today, 10:15 AM",
    amount: 125.0,
    status: "Paid",
  },
  {
    id: 3,
    patient: "Emily Johnson",
    service: "Video Consultation",
    date: "Today, 11:30 AM",
    amount: 75.0,
    status: "Paid",
  },
  {
    id: 4,
    patient: "Michael Davis",
    service: "In-Person Visit",
    date: "Today, 2:00 PM",
    amount: 150.0,
    status: "Paid",
  },
  {
    id: 5,
    patient: "Sarah Wilson",
    service: "Video Consultation",
    date: "Tomorrow, 10:00 AM",
    amount: 75.0,
    status: "Pending",
  },
  {
    id: 6,
    patient: "Robert Brown",
    service: "Video Consultation",
    date: "Tomorrow, 2:15 PM",
    amount: 75.0,
    status: "Pending",
  },
  {
    id: 7,
    patient: "Thomas Harris",
    service: "Emergency Consultation",
    date: "10 minutes ago",
    amount: 200.0,
    status: "Pending",
  },
  {
    id: 8,
    patient: "David Jones",
    service: "Prescription Renewal",
    date: "Yesterday",
    amount: 45.0,
    status: "Overdue",
  },
]

