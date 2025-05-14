import { DollarSign, Trash2 } from "lucide-react";
import AddExpenseForm from "./AddExpenseForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import EditExpenseForm from "./EditExpenseForm";
import ExpenseRepaid from "./ExpenseRepaid";
import DeleteExpense from "./DeleteExpense";

export default function ExpenseTab({ trip, loggedUser }) {
  const getMemberById = (id) => {
    return trip?.members.find((m) => m.id === id);
  };

  const filteredExpenses = trip?.expenses?.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div>
      {trip?.expenses.length === 0 ? (
        <div className="text-center py-12  rounded-lg border">
          <div className=" inline-block p-4 rounded-full mb-4">
            <DollarSign className="h-8 w-8 " />
          </div>
          <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
          <p className=" mb-6">
            Start adding expenses to track your trip spending
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredExpenses.map((expense) => {
            const paidBy = getMemberById(expense.paidById);
            const splitWithMembers = expense?.expenseMembers
              .map((id) => getMemberById(id?.memberId)?.name)
              .filter(Boolean)
              .join(", ");

            return (
              <Card key={expense.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{expense.title}</CardTitle>

                    {loggedUser && (
                      <div className="flex gap-2 items-center">
                        <EditExpenseForm expense={expense} trip={trip} />
                        <DeleteExpense expense={expense} trip={trip} />
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-md">
                    {formatDate(expense.date)} •{" "}
                    {expense.category.charAt(0).toUpperCase() +
                      expense.category.slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-md ">
                        Paid by{" "}
                        <span className="font-medium ">{paidBy?.name}</span>
                      </p>
                      <p className="text-md mt-4">
                        Split with:{" "}
                        <span className="font-bold,">{splitWithMembers}</span>
                      </p>
                    </div>
                    <div className="text-xl font-bold">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>

                  {loggedUser && (
                    <ExpenseRepaid
                      expense={expense}
                      expenseMember={trip?.members.find(
                        (m) => m.id === expense.paidById
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
