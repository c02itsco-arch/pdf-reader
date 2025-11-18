import React from 'react';
import { Asset } from '../types';

interface AssetTableProps {
  assets: Asset[];
}

const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  if (assets.length === 0) {
    return null;
  }

  const headers = ["รหัสทรัพย์สิน", "หมวดหมู่", "รุ่น/โมเดล/ยี่ห้อ", "Serial Number", "สถานที่"];

  return (
    <div className="overflow-x-auto bg-slate-900/50 rounded-lg border border-slate-700 shadow-md">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            {headers.map(header => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-900 divide-y divide-slate-800">
          {assets.map((asset, index) => (
            <tr key={index} className="hover:bg-slate-800/60 transition-colors duration-200">
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