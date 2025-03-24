import { useRouter } from "next/router";


const NotFoundPage = () => {
    const router = useRouter();
    const onPushNewSearch = () => {
        router.push(`/#data-section`);
      };
    return (
        <>
            <div className="flex w-screen h-screen p-4 justify-center items-center bg-white">
                <div className="flex justify-center flex-col">
                    <div className="text-6xl font-bold mb-8">No Data</div>
                    <div className="flex flex-col gap-2">
                        <div className="text-zinc-800">The selected data does not contain any information.</div>
                        <div onClick={onPushNewSearch} className="btn-small">New Search</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotFoundPage;