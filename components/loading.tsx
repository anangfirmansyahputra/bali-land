export default function Loading() {
  return (
    <div className="fixed w-full h-full bg-[#fff] flex items-center justify-center z-[1000] animate-in">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold text-slate-800">bali.land</h1>
        <span className="loader"></span>
      </div>
    </div>
  )
}
