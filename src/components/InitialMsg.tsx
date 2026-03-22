const InitialMsg: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div
        className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"
        role="status"
      ></div>

      <h2 className="mt-4 text-lg font-semibold text-gray-600 tracking-wide">
        INITIALIZING DATA GRID...
      </h2>
    </div>
  );
};

export default InitialMsg;
