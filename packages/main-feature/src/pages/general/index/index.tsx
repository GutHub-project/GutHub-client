import Layout from "./components/Layout";

const General = () => {
  return (
    <Layout>
      <div className="min-h-screen w-full relative overflow-hidden bg-black">

      {/* top blur background */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full 
          bg-white/70 blur-3xl" />

        {/* clouds background */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full 
          bg-white/40 blur-3xl" />

        {/* date tabs */}
        <div className="mt-6 flex items-center justify-center gap-10">
          <span className="text-gray-400">11월 8일</span>
          <span className="text-[#E25A6A] font-bold border-b-2 border-[#E25A6A] pb-1">
            11월 9일
          </span>
          <span className="text-gray-400">11월 10일</span>
        </div>

        {/* illustration */}
        <div className="mt-10 flex justify-center">
          <img
            src="/gut.png"
            className="w-60"
            alt="gut"
          />
        </div>

        {/* status */}
        <div className="mt-8 text-center text-gray-700 text-lg">
          내 장 상태 : <span className="text-[#E25A6A] font-semibold">아파요..</span>
        </div>
      </div>
    </Layout>
  )
}

export default General;