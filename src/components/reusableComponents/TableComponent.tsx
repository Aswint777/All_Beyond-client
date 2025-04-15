// import React, { useState } from "react";

// export interface TableColumn<T> {
//   label: string;
//   key?: keyof T;
//   render?: (item: T) => React.ReactNode; // Custom rendering support
// }

// interface TableProps<T> {
//   columns: TableColumn<T>[]; // Table columns
//   data: T[]; // Table data
//   itemsPerPage?: number; // Items per page (optional)
// }

// const TableComponent = <T,>({ columns, data, itemsPerPage = 5 }: TableProps<T>) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

//   const goToPreviousPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             {columns.map((col, index) => (
//               <th key={index} className="px-4 py-2 border">
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.length === 0 ? (
//             <tr>
//               <td colSpan={columns.length} className="text-center p-4">
//                 No data available
//               </td>
//             </tr>
//           ) : (
//             paginatedData.map((item, rowIndex) => (
//               <tr key={rowIndex} className="text-center">
//                 {columns.map((col, colIndex) => (
//                   <td key={colIndex} className="px-4 py-2 border">
//                     {col.render
//                       ? col.render(item)
//                       : col.key
//                       ? (item[col.key] as React.ReactNode)
//                       : null}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-4">
//           <button
//             onClick={goToPreviousPage}
//             disabled={currentPage === 1}
//             className={`px-3 py-1 border rounded ${
//               currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300 text-white"
//             }`}
//           >
//             «
//             {/* Previous */}
//           </button>
//           <button className="px-3 py-1 border rounded-md text-sm bg-purple-500">

      
//           {currentPage}
//             {/* Page {currentPage} of {totalPages} */}

//           </button>
//           <button
//             onClick={goToNextPage}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1 border rounded ${
//               currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-400 text-white"
//             }`}
//           >
//             »
//             {/* Next */}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TableComponent;



import React from "react";

export interface TableColumn<T> {
  label: string;
  key?: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const TableComponent = <T,>({
  columns,
  data,
  itemsPerPage = 5,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: TableProps<T>) => {
  const goToPreviousPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-2 border">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="text-center">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 border">
                    {col.render
                      ? col.render(item)
                      : col.key
                      ? (item[col.key] as React.ReactNode)
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300 text-black"
            }`}
          >
            «
          </button>
          <span className="px-3 py-1 border rounded-md text-sm bg-purple-500 text-white">
            {currentPage}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-400 text-black"
            }`}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;