import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ROUTES } from '../../utils/paths';
import { config } from '../../configaration/Config';
import TableComponent, { TableColumn } from '../../components/reusableComponents/TableComponent';
import UserNavbar from '../../components/layout/UserNavbar';
import StudentSideBar from '../../components/layout/StudentSideBar';



const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;

interface Transaction {
  _id: string;
  studentName: string;
  instructorName: string;
  courseName: string;
  transactionDate: string;
  instructorShare?: number | null;
  adminShare?: number | null;
  amount?: number | null;
}

interface TransactionResponse {
  transactions: Transaction[];
  totalPages: number;
  currentPage: number;
  totalTransactions: number;
}

const fetchWithAuth = async (
  endpoint: string,
  method = "GET",
  params?: any
) => {
  return axios({
    url: `${API_URL}${ROUTES.STUDENT}/${endpoint}`,
    method,
    params,
    ...config,
  });
};
const StudentTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 2;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth("transactions", "GET", {
          page: currentPage,
          limit: itemsPerPage,
        });
        const {
          transactions,
          totalPages,
          totalTransactions,
        }: TransactionResponse = response.data.data;
        if (!Array.isArray(transactions)) {
          throw new Error("Invalid transaction data");
        }
        setTransactions(transactions);
        setTotalPages(totalPages);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching transactions."
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [currentPage]);

  const columns: TableColumn<Transaction>[] = [
    { label: "Instructor Name", key: "instructorName" },
    { label: "Course Name", key: "courseName" },
    {
      label: "Transaction Date",
      render: (transaction: Transaction) =>
        transaction.transactionDate
          ? new Date(transaction.transactionDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
    },
    {
      label: "Total payment",
      render: (transaction: Transaction) =>
        transaction.amount != null
          ? `₹${transaction.amount.toFixed(2)}`
          : "₹0.00",
    },
  ];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
      <UserNavbar />
    <div className="min-h-screen bg-gray-100 flex">
      <StudentSideBar />
      <main className="flex-1 p-8 mt-14">
        <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <TableComponent
            columns={columns}
            data={transactions}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
    </div>
  );
};




export default StudentTransactionHistory
