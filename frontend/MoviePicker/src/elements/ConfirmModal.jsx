import { RxCross2 } from "react-icons/rx";

function ConfirmModal({ title, isClose, children }) {
    return (
        <div className="w-full h-screen fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-gray-300/95 p-2.5 rounded-xl shadow-black shadow-2xl flex flex-col">
                <div className="flex flex-row justify-between mb-0.5">
                    <div className="text-black font-medium text-lg mr-2.5">{title}</div>
                    <div className="ml-2.5" onClick={isClose}>
                        <RxCross2 className='text-black hover:text-gray-400 hover:scale-95 font-extrabold text-2xl lg:text-3xl' />
                    </div>
                </div>
                <hr className="bg-gray-700"></hr>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal