import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trash2,
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TransactionTable({ filters, refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(0); // Spring Boot pages are 0-indexed
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5; // Number of items per page

  // --- INLINE EDITING STATE ---
  const [editingId, setEditingId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // 1. Reset to page 0 whenever the user changes the Date Filters!
  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  // 2. Fetch Transactions (Now with Pagination!)
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/transactions",
        {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate,
            page: currentPage,
            size: pageSize,
          },
        },
      );

      // console.log("FULL RESPONSE:", response.data);

      setTransactions(response.data.content || []);
      setTotalPages(response.data.page?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // 3. Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Notice we added 'currentPage' to the dependency array!
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [filters, refreshTrigger, currentPage]);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    const toastId = toast.loading("Deleting...");
    try {
      await axios.delete(`http://localhost:8080/api/transactions/${id}`);
      toast.success("Transaction deleted!", { id: toastId });

      // If we delete the last item on a page, jump back one page
      if (transactions.length === 1 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete transaction.", { id: toastId });
    }
  };

  // --- INLINE EDIT LOGIC ---
  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setNewCategoryName(transaction.category?.name || "General");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewCategoryName("");
  };

  const saveCategory = async (id) => {
    const toastId = toast.loading("Updating & Learning...");
    try {
      await axios.put(
        `http://localhost:8080/api/transactions/${id}/category`,
        null,
        {
          params: { newCategoryName: newCategoryName },
        },
      );
      toast.success("Updated! App will remember this.", { id: toastId });
      setEditingId(null);
      fetchTransactions();
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category.", { id: toastId });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              <th className="p-4 rounded-tl-xl">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4">Amount</th>
              <th className="p-4 text-right rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No transactions found for this period.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  {/* DATE */}
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                    {tx.description}
                  </td>

                  {/* CATEGORY (INLINE EDIT) */}
                  <td className="p-4">
                    {editingId === tx.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="bg-white dark:bg-[#27272a] border border-brand-500 text-gray-900 dark:text-white text-xs rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-brand-500/50"
                        >
                          {categories
                            .filter((c) => c.type === tx.type)
                            .map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => saveCategory(tx.id)}
                          className="text-emerald-500 hover:text-emerald-600 p-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-md"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-rose-500 hover:text-rose-600 p-1 bg-rose-50 dark:bg-rose-500/10 rounded-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200">
                          {tx.category?.name || "Uncategorized"}
                        </span>
                        <button
                          onClick={() => startEditing(tx)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-brand-500 transition-all"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-4 text-sm font-bold whitespace-nowrap">
                    <span
                      className={
                        tx.type === "INCOME"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-900 dark:text-white"
                      }
                    >
                      {tx.type === "INCOME" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PREMIUM PAGINATION FOOTER --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] mt-auto">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing Page{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentPage + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalPages}
            </span>
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className={`flex items-center justify-center p-2 rounded-xl transition-all ${
                currentPage === 0
                  ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#27272a] hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev + 1 < totalPages ? prev + 1 : prev,
                )
              }
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center justify-center p-2 rounded-xl transition-all ${
                currentPage >= totalPages - 1
                  ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#27272a] hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
