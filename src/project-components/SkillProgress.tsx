import ".././styles/common.css";

const SkillProgress = () => {
  // Dummy data for product name and progress
  const products = [
    { name: "Negotiations 101", progress: 60 },
    { name: "Selling Personal Insurance", progress: 40 },
    { name: "Selling Business Insurance", progress: 80 }
  ];

  return (
    <div className="max-w-xs mx-auto bg-white overflow-hidden shadow-lg p-4 mt-4 pb-6 rounded-md">
      <h2 className="text-lg font-bold mb-6">Skill Progress</h2>
      {products.map((product, index) => (
        <div key={index} className="flex justify-between items-center border-b pb-2 mb-2">
          <div className="flex items-center">
            <div className="px-3 py-2">
              <div className="text-sm mb-1">{product.name}</div>
              <div className="w-full h-1 bg-gray-200 rounded-md overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${product.progress}%`, borderRadius: '0.3rem' }}></div>
              </div>
            </div>
          </div>
          <button className="adobe-font bg-blue-500 hover:bg-blue-700 text-white font-normal py-1 px-5 rounded-md">
            EXPLORE
          </button>
        </div>
      ))}
    </div>
  );
};

export default SkillProgress;
