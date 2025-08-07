"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Transaction, TransactionStatus } from "@/types/transaction.type";
import { TransactionCard } from "@/components/transaction/TransactionCard";
import { toast } from "sonner";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/organizers/events/${eventId}/transactions`);
        setTransactions(res.data.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchTransactions();
  }, [eventId]);

  const handleStatusChange = async (id: number, newStatus: TransactionStatus) => {
    try {
      await api.patch(`/organizers/transactions/${id}`, {
        status: newStatus,
      });
      toast.success("Status updated");

      setTransactions((prev) =>
        prev.map((txn) =>
          txn.id === id ? { ...txn, status: newStatus } : txn
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        transactions.map((txn) => (
          <TransactionCard
            key={txn.id}
            id={txn.id}
            customer={txn.customer}
            quantity={txn.quantity}
            finalAmount={txn.finalAmount}
            status={txn.status}
            paymentProof={txn.paymentProof}
            onStatusChange={handleStatusChange}
          />
        ))
      )}
    </section>
  );
}