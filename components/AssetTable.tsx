import React, { useState, useMemo } from 'react';
import { Asset } from '../types';
import { SortIcon } from './icons/SortIcon';

interface AssetTableProps {
  assets: Asset[];
}

type SortConfig = {
  key: keyof Asset;
  direction: 'ascending' | 'descending';
};

const headers: { label: string; key: keyof Asset }[] = [
  { label: "รหัสทรัพย์สิน", key: "assetId" },
  { label: "หมวดหมู่", key: "category" },
  { label: "รุ่น/โมเดล/ยี่ห้อ", key: "model" },
  { label: "Serial Number", key: "serialNumber" },
  { label: "สถานที่", key: "location" },
];

const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedAssets = useMemo(() => {
    let sortableItems = [...assets];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [assets, sortConfig]);

  const requestSort = (key: keyof Asset) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  if (assets.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto bg-slate-900/50 rounded-lg border border-slate-700 shadow-md">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            {headers.map(({label, key}) => (
              <th
                key={key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => requestSort(key)}
              >
                <div className="flex items-center gap-2">
                  {label}
                  <SortIcon 
                    className="w-4 h-4"
                    direction={sortConfig?.key === key ? sortConfig.direction : undefined}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-900 divide-y divide-slate-800">
          {sortedAssets.map((asset, index) => (
            <tr key={index} className="even:bg-slate-800/40 hover:bg-slate-700/60 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{asset.assetId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                  {asset.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{asset.model}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{asset.serialNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{asset.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;