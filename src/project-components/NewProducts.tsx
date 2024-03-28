const NewProduct = () => {
  // Define two products statically
  const products = [
    {
      imageUrl: "/images/newProduct1.png",
      name: "Digital Risks Insurance",
      description: "Designed for tech companies, Digital Risks Insurance uses a pay-as-you-go policy for insurance companies.",
    },
    {
      imageUrl: "/images/newProduct2.png",
      name: "Cybersecurity Suite",
      description: "Protect your digital assets with our comprehensive Cybersecurity Suite, designed to defend against the latest cyber threats.",
    }
  ];

  return (
    <div className="max-w-lg mt-4">
      <div className="bg-white shadow-lg p-4 mb-4 mx-auto bg-white overflow-hidden shadow-lg p-4 mt-4 pb-6 rounded-md">
        <h2 className="font-bold text-md mb-9">New Products</h2> {/* Move the heading inside the product container */}
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between mb-6">
            <div className="w-1/4 mr-4">
              <img className="w-full" src={product.imageUrl} alt={product.name} />
            </div>
            <div className="w-3/4">
              <div className="font-bold text-sm mb-1">{product.name}</div>
              <p className="text-gray-700 text-xs">{product.description}</p> 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProduct;
