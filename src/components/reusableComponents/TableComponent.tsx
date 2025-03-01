// import React from "react";

// interface TableColumn<T> {
//   label: string;
//   key?: keyof T; // Made key optional to support render-only columns
//   render?: (item: T) => React.ReactNode;
// }

// interface TableProps<T> {
//   columns: TableColumn<T>[];
//   data: T[];
// }

// const TableComponent = <T,>({ columns, data }: TableProps<T>) => {
//   return (
//     <table className="w-full table-auto border-collapse border">
//       <thead>
//         <tr className="bg-gray-200">
//           {columns.map((col, index) => (
//             <th key={index} className="px-4 py-2 border">{col.label}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, rowIndex) => (
//           <tr key={rowIndex} className="text-center">
//             {columns.map((col, colIndex) => (
//               <td key={colIndex} className="px-4 py-2 border">
//                 {col.render ? col.render(item) : col.key ? (item[col.key] as React.ReactNode) : null}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default TableComponent;




// import React from "react";

// interface TableColumn<T> {
//   label: string;
//   key?: keyof T; // Key is optional to support custom render columns
//   render?: (item: T) => React.ReactNode;
// }

// interface TableProps<T> {
//   columns: TableColumn<T>[];
//   data: T[];
// }

// const TableComponent = <T,>({ columns, data }: TableProps<T>) => {
//   return (
//     <table className="w-full table-auto border-collapse border">
//       <thead>
//         <tr className="bg-gray-200">
//           {columns.map((col, index) => (
//             <th key={index} className="px-4 py-2 border">{col.label}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, rowIndex) => (
//           <tr key={rowIndex} className="text-center">
//             {columns.map((col, colIndex) => (
//               <td key={colIndex} className="px-4 py-2 border">
//                 {col.render ? col.render(item) : col.key ? (item[col.key] as React.ReactNode) : null}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default TableComponent;





    import React from "react";

   export interface TableColumn<T> {
    label: string;
    key?: keyof T;
    render?: (item: T) => React.ReactNode; // Custom rendering support
    }

    interface TableProps<T> {
    columns: TableColumn<T>[]; // Table columns
    data: T[]; // Table data
    }

    const TableComponent = <T,>({ columns, data }: TableProps<T>) => {
    return (
        <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
            <thead>
            <tr className="bg-gray-200">
                {columns.map((col, index) => (
                <th key={index} className="px-4 py-2 border">{col.label}</th>
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
                        {col.render ? col.render(item) : col.key ? item[col.key] as React.ReactNode : null}
                    </td>
                    ))}
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
    };

    export default TableComponent;
