import { Card, CardContent } from "@/components/ui/card";
import { calculateBalances, formatCurrency } from "@/lib/utils";

export default function BalanceTab({ trip }) {
  const balances = calculateBalances(trip);

  return (
    <div>
      <div className="grid gap-4">
        {trip?.members.map((member) => {
          const balance = balances[member.id] || 0;
          return (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{member.name}</div>
                  <div
                    className={`font-bold ${
                      balance > 0
                        ? "text-green-600"
                        : balance < 0
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {formatCurrency(balance)}
                  </div>
                </div>
                <div className="text-sm  mt-1">
                  {balance > 0
                    ? "is owed money"
                    : balance < 0
                    ? "owes money"
                    : "is settled up"}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
