import React from "react";

const shimmer = "animate-pulse bg-zinc-800 rounded-xl";

export const SkeletonCard: React.FC = () => (
  <div className="border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/40">
    <div className="space-y-3 flex-1 w-full">
      <div className="flex items-center gap-3">
        <div className={`${shimmer} h-5 w-24`} />
        <div className={`${shimmer} h-4 w-20`} />
      </div>
      <div className={`${shimmer} h-4 w-48`} />
      <div className="flex gap-2 items-center">
        <div className={`${shimmer} h-4 w-12`} />
        <div className={`${shimmer} h-5 w-20`} />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className={`${shimmer} h-6 w-20 rounded-full`} />
      <div className={`${shimmer} h-8 w-28 rounded-full`} />
    </div>
  </div>
);

export const SkeletonTableRow: React.FC = () => (
  <tr>
    <td className="p-4"><div className={`${shimmer} h-4 w-16`} /></td>
    <td className="p-4"><div className={`${shimmer} h-4 w-28`} /></td>
    <td className="p-4"><div className={`${shimmer} h-4 w-24`} /></td>
    <td className="p-4 text-right"><div className={`${shimmer} h-4 w-16 ml-auto`} /></td>
    <td className="p-4 text-right"><div className={`${shimmer} h-4 w-14 ml-auto`} /></td>
    <td className="p-4"><div className={`${shimmer} h-5 w-20 rounded-full`} /></td>
    <td className="p-4 text-center"><div className={`${shimmer} h-6 w-24 mx-auto rounded-full`} /></td>
  </tr>
);

export const SkeletonKPI: React.FC = () => (
  <div className="bg-zinc-900/60 rounded-2xl p-5 border border-white/5">
    <div className={`${shimmer} h-3 w-24 mb-3`} />
    <div className={`${shimmer} h-8 w-28`} />
  </div>
);
