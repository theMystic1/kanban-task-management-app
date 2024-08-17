import Home from "../../_components/home/Home";

type pageProps = {
  params: object;
};

function page({ params }: pageProps) {
  return (
    <div className="h-[90%]">
      <Home />
    </div>
  );
}

export default page;
