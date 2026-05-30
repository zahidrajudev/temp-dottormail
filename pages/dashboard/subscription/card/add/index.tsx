import DashLayout from "@/layouts/DashLayout";
import CardAddPage from "@/modules/dashboard/subscription/card/add";
import Head from "next/head";
import { ReactElement } from "react";

function CardAddIndex() {
  return (
    <>
      <Head>
        <title>Add New Card</title>
      </Head>
      <CardAddPage />
    </>
  );
}

CardAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default CardAddIndex;
