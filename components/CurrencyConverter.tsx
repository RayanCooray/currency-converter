"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCcw, Trash2, DollarSign } from "lucide-react";
import { countries } from "@/data/countries/countries";

interface Transfer {
  _id: string;
  amount: number;
  fromCountry: string;
  convertedAmount: number;
  toCountry: string;
}

export default function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("LKR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [history, setHistory] = useState<Transfer[]>([]);

  const handleConvert = async () => {
    const res = await axios.post("https://currencyconverterbackend-production-f654.up.railway.app/convert", { from, to, amount });  
    setConvertedAmount(res.data.convertedAmount);
    fetchTransfers();
  };

  const fetchTransfers = async () => {
    const res = await axios.get("https://currencyconverterbackend-production-f654.up.railway.app/transfers");
    setHistory(res.data);
  };

  const handleRevoke = async (id: string) => {
    await axios.delete(`https://currencyconverterbackend-production-f654.up.railway.app/transfers/${id}`);
    fetchTransfers();
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-lg text-center mb-6">
        <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
          <DollarSign className="text-green-500" /> Currency Converter
        </h1>
      </div>

      <Card className="w-full max-w-lg shadow-xl border border-gray-700 bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6">
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select onValueChange={setFrom} value={from}>
              <SelectTrigger className="w-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/40 dark:border-gray-700 rounded-lg shadow-md p-3">
                <SelectValue placeholder="From Currency" />
              </SelectTrigger>
              <SelectContent className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/40 dark:border-gray-700 rounded-lg shadow-lg">
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setTo} value={to}>
              <SelectTrigger className="w-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/40 dark:border-gray-700 rounded-lg shadow-md p-3">
                <SelectValue placeholder="To Currency" />
              </SelectTrigger>
              <SelectContent className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/40 dark:border-gray-700 rounded-lg shadow-lg">
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-lg shadow-md p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/40 dark:border-gray-700"
          />

          <Button onClick={handleConvert} className="w-full flex items-center gap-2 rounded-lg shadow-md p-3 bg-green-500 hover:bg-green-600">
            <RefreshCcw className="w-4 h-4" /> Convert
          </Button>

          {convertedAmount && (
            <h2 className="text-lg font-medium mt-4 text-center">
              Converted Amount: <span className="font-bold">{convertedAmount} {to}</span>
            </h2>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <DollarSign className="text-blue-500" /> Transfer History
        </h2>
        <ul className="space-y-2">
          {history.map((transfer) => (
            <li key={transfer._id} className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 border border-white/40 dark:border-gray-700 rounded-lg shadow-md bg-gray-800/30 backdrop-blur-md text-sm sm:text-base">
              <span className="w-full sm:w-auto text-center sm:text-left">
                {transfer.amount} {transfer.fromCountry} → {transfer.convertedAmount} {transfer.toCountry}
              </span>
              <Button variant="destructive" size="sm" onClick={() => handleRevoke(transfer._id)} className="mt-2 sm:mt-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}