import { useRouter } from "next/router";

const Custom500 = () => {
  const router = useRouter();
  const onPushNewSearch = () => {
    router.push(`/`);
  };
  return (
    <>
      <div className="flex w-screen h-screen p-4 justify-center items-center bg-white">
        <div className="flex justify-center flex-col">
          <div className="text-6xl font-bold mb-8">500</div>
          <div className="flex flex-col gap-2">
            <div className="text-zinc-800">{`Something went wrong on our end. Our team has been notified of the issue, and we're working diligently to fix it. Please try to refresh this page or again later.`}</div>
            <div className="text-zinc-400">{`Error code: 500`}</div>
            <div onClick={onPushNewSearch} className="btn-small">
              Go Home
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom500;
