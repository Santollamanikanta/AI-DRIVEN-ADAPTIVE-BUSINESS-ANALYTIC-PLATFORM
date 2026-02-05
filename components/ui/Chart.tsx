
import React from 'react';
import type { ChartData } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface ChartProps {
  type: 'bar' | 'pie';
  data: ChartData[];
}

const COLORS = ['#14b8a6', '#f59e0b', '#64748b', '#5eead4', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-200 rounded-md shadow-lg">
          <p className="label text-slate-800">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

const Chart: React.FC<ChartProps> = ({ type, data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-slate-500">No data available for chart.</div>;
  }
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(226, 232, 240, 0.5)'}}/>
            <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              stroke="#fff"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
