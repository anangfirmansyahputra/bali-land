import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ModalProps {
  data: any;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowActivities: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalDetail({
  data,
  setShowModal,
  setShowActivities
}: ModalProps) {
  const [showDetail, setShowDetail] = useState<boolean>(true)

  return (
    <div className="absolute z-[850] p-2 w-full sm:w-[516px]">
      <div className='rounded-lg bg-gray-100 p-4 max-w-full xs:max-w-[500px] w-[100%] space-y-5 shadow-lg'>
        <div className="flex space-x-10 justify-between">
          <button
            className="text-blue-500 text-sm hover:text-blue-600 transition flex items-center gap-1"
            onClick={() => setShowModal(false)}
          >
            <ChevronLeft className="w-4 h-4 text-blue-500 hover:text-blue-600" /> Back
          </button>
          <div className='flex flex-col items-center space-y-1'>
            <div className="font-semibold text-sm">Titik Koordinat</div>
            <div className="text-xs flex gap-[2px] sm:gap-1 sm:flex-row flex-col items-center">
              <div>{data?.center?.lat}</div>
              <div>-</div>
              <div>{data?.center?.lng}</div>
            </div>
          </div>
          <button
            className="text-blue-500 w-[40px] text-sm hover:text-blue-600 transition"
            onClick={() => setShowDetail((prev) => !prev)}
          >
            {showDetail ? "Resize" : "Detail"}
          </button>
        </div>
        {showDetail && (
          <div>
            <div className="text-gray-600 font-light text-sm hover:text-gray-700 transition hover:cursor-pointer duration-500 inline">{data?.zone?.code} - Zona {data?.zone?.name}</div>
            <div className="bg-white rounded-lg p-2 mt-1">
              <div className="flex items-start gap-2">
                <div className="text-sm text-white bg-pink-300/50 w-fit px-2 py-1 rounded-lg">
                  {data?.zone?.code}
                </div>
                <div className="flex flex-col border-b w-full pb-2">
                  <div className="text-sm">
                    {data?.zone?.code}
                  </div>
                  <div className="text-xs text-gray-400 font-light">
                    {data?.zone?.name}
                  </div>
                </div>
              </div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowActivities(true)}
              >
                <div className="text-sm font-light py-2">Kegiatan yang diizinkan</div>
                <div className="flex items-center">
                  <div className="text-[10px] w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center">
                    {data?.zone?.activities?.filter((activity: any) => activity.pivot.x === false)?.length}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        <button className="bg-blue-500 w-full rounded-lg text-white py-2 text-sm hover:bg-blue-600 transition ease-out">Print</button>
      </div>
    </div>

  )
}
