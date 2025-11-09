import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dummyApiResponse = [
  { month: 1, temperature: 21.4, turbidity: 2.3, pH: 6.8 },
  { month: 2, temperature: 22.1, turbidity: 2.6, pH: 7.0 },
  { month: 3, temperature: 23.5, turbidity: 3.0, pH: 6.9 },
  { month: 4, temperature: 25.0, turbidity: 2.7, pH: 7.1 },
  { month: 5, temperature: 27.2, turbidity: 3.5, pH: 7.3 },
  { month: 6, temperature: 29.1, turbidity: 4.0, pH: 7.5 },
  { month: 7, temperature: 28.5, turbidity: 3.2, pH: 7.2 },
  { month: 8, temperature: 27.0, turbidity: 2.9, pH: 7.0 },
  { month: 9, temperature: 25.6, turbidity: 2.8, pH: 6.9 },
  { month: 10, temperature: 23.0, turbidity: 2.4, pH: 6.8 },
  { month: 11, temperature: 22.2, turbidity: 2.1, pH: 6.7 },
  { month: 12, temperature: 21.0, turbidity: 2.0, pH: 6.6 }
];

export default function WaterQualityChart({ sourceId, year }) {
  const [data, setData] = useState([]);
  const [useDummy, setUseDummy] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (useDummy) {
        const result = months.map((monthName, i) => {
          const record = dummyApiResponse.find(d => d.month === i + 1);
          return {
            month: monthName,
            temperature: record?.temperature ?? null,
            turbidity: record?.turbidity ?? null,
            pH: record?.pH ?? null
          };
        });
        setData(result);
      } else {
        const res = await axios.get(`http://localhost:5000/waterQuality/monthly/${sourceId}/${year}`);
        const result = months.map((monthName, i) => {
          const record = res.data.find(d => d.month === i + 1);
          return {
            month: monthName,
            temperature: record?.temperature ?? null,
            turbidity: record?.turbidity ?? null,
            pH: record?.pH ?? null
          };
        });
        setData(result);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [sourceId, year, useDummy]);

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-center" style={{
            textTransform: "uppercase",
            color: "#0d6efd",
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
          }}>Water Quality for {year}</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm">Use Dummy Data</label>
          <input
            type="checkbox"
            checked={useDummy}
            onChange={() => setUseDummy(prev => !prev)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
            <Line type="monotone" dataKey="turbidity" stroke="#82ca9d" name="Turbidity (NTU)" />
            <Line type="monotone" dataKey="pH" stroke="#ffc658" name="pH Level" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// const WaterQualityChart = ({ data }) => (
//   <ResponsiveContainer width="100%" height={300}>
//     <LineChart data={data}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="month" />
//       <YAxis />
//       <Tooltip />
//       <Legend />
//       <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temp (°C)" />
//       <Line type="monotone" dataKey="turbidity" stroke="#82ca9d" name="Turbidity (NTU)" />
//       <Line type="monotone" dataKey="pH" stroke="#ffc658" name="pH" />
//     </LineChart>
//   </ResponsiveContainer>
// );

// export default function AllWaterSourcesDashboard({ year = new Date().getFullYear() }) {
//   const [sources, setSources] = useState([]);
//   const [qualityData, setQualityData] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadSourcesAndData = async () => {
//       try {
//         const sourcesRes = await axios.get('/api/water-sources');
//         setSources(sourcesRes.data);

//         const dataMap = {};
//         await Promise.all(sourcesRes.data.map(async (source) => {
//           const res = await axios.get(`/api/water-quality/monthly/${source._id}/${year}`);
//           const formatted = months.map((month, i) => {
//             const record = res.data.find(d => d.month === i + 1);
//             return {
//               month,
//               temperature: record?.temperature ?? null,
//               turbidity: record?.turbidity ?? null,
//               pH: record?.pH ?? null
//             };
//           });
//           dataMap[source._id] = formatted;
//         }));

//         setQualityData(dataMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     loadSourcesAndData();
//   }, [year]);

//   if (loading) return <p>Loading water sources and charts...</p>;

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-3xl font-bold mb-6">Water Quality Overview for {year}</h1>
//       {sources.map(source => (
//         <div key={source._id} className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold">{source.sourceName}</h2>
//           <p className="text-sm text-gray-600 mb-4">{source.sourceAddress}</p>
//           <p className="text-sm text-gray-600">Capacity: {source.capacity}, Storage: {source.storage}</p>
//           {qualityData[source._id] ? (
//             <WaterQualityChart data={qualityData[source._id]} />
//           ) : (
//             <p className="text-red-500">No water quality data available for this source.</p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }




