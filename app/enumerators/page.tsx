// export default function EnumeratorsPage() {
//     return (
//       <div>
//         <h1 className="text-2xl font-bold">Enumerators</h1>
//         <p>Manage your enumerators here.</p>
//       </div>
//     );
//   }
  
"use client";

export default function EnumeratorsPage() {
  // Sample enumerators data
  const enumerators = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "+234 901 234 5678" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "+234 902 345 6789" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", phone: "+234 903 456 7890" },
    { id: 4, name: "David White", email: "david@example.com", phone: "+234 904 567 8901" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enumerators</h1>
      <p className="text-gray-600 mb-6">Manage your enumerators here.</p>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left text-gray-600">ID</th>
              <th className="p-3 text-left text-gray-600">Name</th>
              <th className="p-3 text-left text-gray-600">Email</th>
              <th className="p-3 text-left text-gray-600">Phone</th>
              <th className="p-3 text-center text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enumerators.map((enumerator) => (
              <tr key={enumerator.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{enumerator.id}</td>
                <td className="p-3">{enumerator.name}</td>
                <td className="p-3">{enumerator.email}</td>
                <td className="p-3">{enumerator.phone}</td>
                <td className="p-3 text-center">
                  <button className="text-blue-500 hover:text-blue-700 mx-2">Edit</button>
                  <button className="text-red-500 hover:text-red-700 mx-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
