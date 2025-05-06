import { Card, CardContent } from "@/components/ui/card";
import { calculateDebts, formatCurrency } from "@/lib/utils";

export default function SettlementTab({ trip }) {
  const debts = calculateDebts(trip);

  const getMemberById = (id) => {
    return trip?.members.find((m) => m.id === id);
  };

  return (
    <div>
      {debts.length === 0 ? (
        <div className="text-center py-12  rounded-lg border">
          <h3 className="text-xl font-semibold mb-2">All settled up!</h3>
          <p className="">Everyone has paid their fair share.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {debts.map((debt, index) => {
            const from = getMemberById(debt.from);
            const to = getMemberById(debt.to);
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {from?.name} owes {to?.name}
                      </p>
                      <p className="text-sm  mt-1">
                        Payment needed to settle balance
                      </p>
                    </div>
                    <div className="text-xl font-bold">
                      {formatCurrency(debt.amount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
