const Card = ({ title, value }: { title: string; value: string }) => {
    return (
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xl font-bold">{value}</p>
      </div>
    );
  };
  
  export default Card;
  