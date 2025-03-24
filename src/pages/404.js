import { useRouter } from "next/router";

const Custom404 = () => {
  const router = useRouter();
  const onPushNewSearch = () => {
    router.push(`/`);
  };
  return (
    <>
      <div className="flex w-screen h-screen p-4 justify-center items-center bg-white">
        <div className="flex justify-center flex-col">
          <div className="text-6xl font-bold mb-8">404</div>
          <div className="flex flex-col gap-2">
            <div className="text-zinc-800">{`We can't seem to find the page you're are looking.`}</div>
            <div className="text-zinc-400">{`Error code: 404`}</div>
            <div onClick={onPushNewSearch} className="btn-small">
              Go Home
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
