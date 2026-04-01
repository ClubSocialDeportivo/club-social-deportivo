const InfoBox = ({ icon, label, value }) => (
  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-800">
    <div className="text-gray-500 mb-1">{icon}</div>
    <p className="text-xs text-gray-500 uppercase font-bold">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

export default InfoBox; 