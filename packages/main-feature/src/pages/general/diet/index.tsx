import Rate from "./components/rate";
import Record from "./components/record";

const Diet = () => {
  return (
    <div className="flex flex-col min-h-[61vh] bg-white rounded-t-[30px] p-[20px] h-full gap-[24px] shadow-[0px_1px_12.6px_0px_rgba(255,45,45,0.25)]">
      <Rate />
      <Record />
    </div>
  )
}

export default Diet;