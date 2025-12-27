import DateStatus from "../dateStatus";
import Diet from "../diet";

import Layout from "./components/Layout";

const General = () => {
  return (
    <Layout>
      <section className="flex flex-col gap-[15px]">
        <DateStatus />
        <Diet />
      </section>
    </Layout>
  )
}

export default General;