"use client";
import { useParams } from "next/navigation";

export default function StatePage() {
  const { state } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Data for {state}</h1>
      <table className="w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Metric</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((id) => (
            <tr key={id}>
              <td className="border p-2">{id}</td>
              <td className="border p-2">Sample Name</td>
              <td className="border p-2">100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
