const Network = () => {
  // Dummy data for network members with existing user images
  const networkMembers = [
    { name: "John Doe", imageUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Alice Smith", imageUrl: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Bob Johnson", imageUrl: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "Emily Brown", imageUrl: "https://randomuser.me/api/portraits/women/4.jpg" },
    { name: "Michael Wilson", imageUrl: "https://randomuser.me/api/portraits/men/5.jpg" },
    { name: "Emma Taylor", imageUrl: "https://randomuser.me/api/portraits/women/6.jpg" },
    { name: "David Martinez", imageUrl: "https://randomuser.me/api/portraits/men/7.jpg" },
    { name: "Sarah Garcia", imageUrl: "https://randomuser.me/api/portraits/women/8.jpg" },
    { name: "James Hernandez", imageUrl: "https://randomuser.me/api/portraits/men/9.jpg" }
  ];

  return (
    <div className="mx-auto bg-white overflow-hidden shadow-lg p-4" style={{ maxWidth: '100%' }}>
      <h2 className="text-md font-bold mb-2">Olivia's Network</h2>
      <div className="flex justify-between text-gray-500 text-sm mb-2">
        <span>Olivia's Network</span>
        <span>1,225 people</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {networkMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              className="w-12 h-12 rounded-full"
              src={member.imageUrl}
              alt={member.name}
            />
            <div className="mt-1">
              <h2 className="text-xs">{member.name}</h2>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <a href="#" className="text-blue-500 underline">Show all</a>
      </div>
    </div>
  );
};

export default Network;
