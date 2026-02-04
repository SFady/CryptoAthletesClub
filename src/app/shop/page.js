"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  return (
    <main className="flex flex-col items-center pt-24 px-6 md:px-16 w-full h-full">
      <table>
         <thead>
              <tr>
                <th className="px-4 py-1"></th>
                <th className="px-4 py-1"></th>
                <th className="px-4 py-1"></th>
              </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-1">Chaussettes</td>
            <td className="px-4 py-1">10$</td>
            <td className="px-4 py-1"><button className="bg-blue-500 text-white px-3 py-1 rounded">Acheter</button>&nbsp;<button className="bg-blue-500 text-white px-3 py-1 rounded">Vendre</button></td>
          </tr>
          <tr>
            <td className="px-4 py-1">T-Shirt</td>
            <td className="px-4 py-1">25$</td>
            <td className="px-4 py-1"><button className="bg-blue-500 text-white px-3 py-1 rounded">Acheter</button>&nbsp;<button className="bg-blue-500 text-white px-3 py-1 rounded">Vendre</button></td>
          </tr>
          <tr>
            <td className="px-4 py-1">Short</td>
            <td className="px-4 py-1">50$</td>
            <td className="px-4 py-1"><button className="bg-blue-500 text-white px-3 py-1 rounded">Acheter</button>&nbsp;<button className="bg-blue-500 text-white px-3 py-1 rounded">Vendre</button></td>
          </tr>
          <tr>
            <td className="px-4 py-1">Chaussures</td>
            <td className="px-4 py-1">100$</td>
            <td className="px-4 py-1"><button className="bg-blue-500 text-white px-3 py-1 rounded">Acheter</button>&nbsp;<button className="bg-blue-500 text-white px-3 py-1 rounded">Vendre</button></td>
          </tr>
          <tr>
            <td className="px-4 py-1">Montre</td>
            <td className="px-4 py-1">200$</td>
            <td className="px-4 py-1"><button className="bg-blue-500 text-white px-3 py-1 rounded">Acheter</button>&nbsp;<button className="bg-blue-500 text-white px-3 py-1 rounded">Vendre</button></td>
          </tr>
          <tr>
            <td className="px-4 py-1">Personnage</td>
            <td className="px-4 py-1">400$</td>
            <td className="px-4 py-1"><button className="bg-blue-500 text-white px-3 py-1 rounded">Acheter</button>&nbsp;<button className="bg-blue-500 text-white px-3 py-1 rounded">Vendre</button></td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
