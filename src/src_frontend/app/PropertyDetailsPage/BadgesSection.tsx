// components/BadgesSection.tsx

const BadgesSection: React.FC = () => {
    return (
      <div className="flex gap-2 justify-center my-4">
        <span className="bg-white border border-gray text-black text-xs px-2 py-1 rounded-sm">Listed by Broker</span>
        <span className="bg-white border border-gray text-black text-xs px-2 py-1 rounded-sm">Rented Out</span>
        <span className="bg-white border border-gray text-black text-xs px-2 py-1 rounded-sm">Wrong Info</span>
      </div>
    );
  };
  
  export default BadgesSection;
  