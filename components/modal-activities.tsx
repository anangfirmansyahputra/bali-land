import { ChevronRight, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ModalActivitiesProps {
  data: any;
  setShowActivities: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDetailActivity: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalActivities({
  data,
  setShowActivities,
  setShowDetailActivity
}: ModalActivitiesProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const activities = data.zone.activities;
  const [filterActivities, setFilterActivities] = useState(activities);

  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
  };

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const delayedSearch: (keyword: string) => void = debounce(
    (keyword: string) => {
      const filteredActivities = activities.filter((activity: any) =>
        activity.name.toLowerCase().includes(keyword)
      );
      setFilterActivities(filteredActivities);
    },
    500
  );


  // console.log(activities);

  const handleCloseModal = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      // Click happened outside the modal, close the modal
      setShowActivities(false);
    }
  };

  useEffect(() => {
    // Attach the event listener
    document.addEventListener('click', handleCloseModal);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleCloseModal);
    };
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[900] bg-[#00000068] flex items-center justify-center"
    >
      <div ref={modalRef} className="w-[90%] md:w-[80%] xl:w-[50%] bg-gray-100 rounded-lg p-4 pb-5 text-sm">
        <div className="flex items-center justify-between">
          <button className="text-blue-500 text-sm hover:text-blue-600 transition">Back</button>
          <div className="flex flex-col items-center">
            <div className="font-medium text-base">{data?.zone?.code}</div>
            <div className="text-gray-600">{data?.zone?.name}</div>
          </div>
          <button
            className="text-blue-500 text-sm hover:text-blue-600 transition"
            onClick={() => {
              setShowFilter((prev) => !prev)
            }}
          >
            {showFilter ? "Cancel" : "Search"}
          </button>
        </div>

        {
          showFilter &&
          <input
            className='w-full mt-3 outline-blue-500 px-4 py-3 rounded-lg placeholder:text-sm font-light'
            placeholder='Contoh: Rumah,Toko atau Kantor'
            autoFocus
            onChange={(e) => {
              handleSearch(e);
              delayedSearch(searchKeyword);
            }}
          />
        }

        <div className="mt-7">
          <button className="px-2 pb-5 border-b-2 text-blue-600 font-medium border-b-blue-600">List Kegiatan</button>
        </div>

        <div className={`bg-white p-2 rounded-lg mt-2 overflow-y-auto ${filterActivities.length > 4 && "h-[350px]"}`}>
          {filterActivities.length > 0 ?
            filterActivities.map((activity: any) => (
              <div
                key={activity.id}
                className='flex items-center gap-1'
              >
                <Check className='text-white w-5 h-5 sm:w-6 sm:h-6 p-1 bg-emerald-600 rounded-lg' role='button' />
                <div className='flex items-center gap-1 flex-1  border-b'>
                  <div className="p-2 space-y-1 flex-1">
                    <div className='sm:text-base font-light w-full'>{activity.name}</div>
                    <div className="text-xs text-gray-400">Diizinkan</div>
                  </div>
                  <ChevronRight
                    className='text-gray-400 w-4 h-4 sm:w-6 sm:h-6'
                    role='button'
                    onClick={() => setShowDetailActivity(true)}
                  />
                </div>
              </div>
            )) :
            <div className='p-2 rounded-lg'>Kegiatan tidak ditemukan</div>
          }
        </div>
      </div>
    </div>
  )
}
