import Home from "../../_components/home/Home";

type pageProps = {
  params: object;
};

export async function generateMetadata({
  params,
}: {
  params: { board: string };
}) {
  return {
    title: `${params?.board.toUpperCase()}`,
  };
}

async function page({ params }: pageProps) {
  return (
    <div className="h-[90%]">
      <Home />
    </div>
  );
}

export default page;
