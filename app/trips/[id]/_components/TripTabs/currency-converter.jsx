"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";

// Mock exchange rates - in a real app, these would come from an API
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.82,
  CAD: 1.37,
  AUD: 1.53,
  CHF: 0.89,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.05,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    if (!amount || isNaN(Number(amount))) return;

    const amountNum = Number.parseFloat(amount);
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];

    // Convert to USD first, then to target currency
    const resultValue = (amountNum / fromRate) * toRate;
    setResult(resultValue);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (result !== null) {
      setAmount(result.toFixed(2));
      setResult(Number.parseFloat(amount));
    }
  };

  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>
          Convert between different currencies for your trip
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Select
                value={fromCurrency}
                onValueChange={(value) => setFromCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(exchangeRates).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={handleSwap}>
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Result</label>
              <Input
                readOnly
                value={result !== null ? result.toFixed(2) : ""}
                placeholder="Converted amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select
                value={toCurrency}
                onValueChange={(value) => setToCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(exchangeRates).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full" onClick={handleConvert}>
            Convert
          </Button>

          {result !== null && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                {formatCurrency(Number.parseFloat(amount), fromCurrency)} ={" "}
                {formatCurrency(result, toCurrency)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                1 {fromCurrency} ={" "}
                {(
                  exchangeRates[toCurrency] / exchangeRates[fromCurrency]
                ).toFixed(4)}{" "}
                {toCurrency}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
