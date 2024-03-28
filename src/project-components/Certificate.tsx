import React from 'react';

interface CertificateCardProps {
  imageUrl: string;
  name: string;
  description: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ imageUrl, name, description }) => {
  return (
    <div className="max-w-xs mx-auto bg-white overflow-hidden shadow-lg p-4">
      <img className="w-80 h-30" src={imageUrl} alt={name} />
      <div className="px-3 py-2">
        <div className="font-bold text-sm mb-1">{name}</div>
        <p className="text-gray-700 text-xs">{description}</p>
      </div>
    </div>
  );
};

export default CertificateCard;
