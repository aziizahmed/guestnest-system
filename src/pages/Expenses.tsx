import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  sub_category: z.string().min(1, "Sub category is required"),
  amount: z.number().min(0, "Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  payment_mode: z.string().min(1, "Payment mode is required"),
  description: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface Expense {
  id: string;
  category: string;
  sub_category: string;
  amount: number;
  date: string;
  payment_mode: string;
  description?: string;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: "",
      sub_category: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      payment_mode: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch expenses",
        variant: "destructive",
      });
      return;
    }

    setExpenses(data);
  };

  const onSubmit = async (data: ExpenseFormData) => {
    const { error } = await supabase
      .from('expenses')
      .insert(data);

    if (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
      return;
    }

    fetchExpenses();
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
    form.reset();
  };

  const categories = [
    {
      name: "Salaries",
      subCategories: ["Chef", "Security", "Housekeeping", "Manager"],
    },
    {
      name: "Maintenance",
      subCategories: ["Electrical", "Plumbing", "Furniture", "Appliances"],
    },
    {
      name: "Utilities",
      subCategories: ["Electricity", "Water", "Internet", "Gas"],
    },
    {
      name: "Supplies",
      subCategories: ["Kitchen", "Cleaning", "Toiletries", "Stationery"],
    },
    {
      name: "Others",
      subCategories: ["Miscellaneous"],
    },
  ];

  const paymentModes = ["Cash", "Bank Transfer", "UPI", "Credit Card", "Debit Card"];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Expenses Management</h2>
          <p className="text-gray-600">Track and manage all PG expenses</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Expense</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem 
                              key={category.name} 
                              value={category.name.toLowerCase()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sub_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories
                            .find(
                              (cat) =>
                                cat.name.toLowerCase() === form.watch("category")
                            )
                            ?.subCategories.map((sub) => (
                              <SelectItem 
                                key={sub} 
                                value={sub.toLowerCase()}
                              >
                                {sub}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentModes.map((mode) => (
                            <SelectItem 
                              key={mode} 
                              value={mode.toLowerCase().replace(/\s+/g, '_')}
                            >
                              {mode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Add Expense
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                  {expense.category.replace(/_/g, ' ')}
                </span>
                <span className="ml-2 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 capitalize">
                  {expense.sub_category.replace(/_/g, ' ')}
                </span>
              </div>
              <span className="text-lg font-semibold">₹{expense.amount}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Date: {new Date(expense.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Payment: {expense.payment_mode.replace(/_/g, ' ')}</p>
              {expense.description && (
                <p className="text-sm text-gray-600">{expense.description}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Expenses;