export function LoadingPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="w-[90%] max-w-md p-5 bg-gray-700 flex flex-col items-center gap-3 rounded-xl shadow-2xl shadow-blue-500/20">
        <h1 className="text-3xl text-red-500 font-bold">Loading data...</h1>
      </div>
    </div>
  );
}
