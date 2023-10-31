import { useRef } from "react";

interface ModalDetailActivityProps {
  data: any;
  setShowDetailActivity: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalDetailActivity({
  data,
  setShowDetailActivity
}: ModalDetailActivityProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[999] bg-[#000000a3] flex items-center justify-center"
    >
      <div className="w-[70%] bg-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <button className="w-[50px] text-sm text-blue-600">Close</button>
          <div className="flex flex-col items-center gap-1">
            <div>Rumah penduduk setempat (eksisting)</div>
            <div>Diizinkan</div>
          </div>
          <div className="w-[50px]"></div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="bg-white p-2 rounded-lg">
            <div>Diizinkan</div>
            <div>Kegiatan dan Penggunaan Lahan Yang Diperbolehkan/ Diizinkan</div>
          </div>

          <div className="bg-white p-2 rounded-lg">
            <div>Intensitas Pemanfaatan Ruang</div>
            <table>
              <thead>
                <tr>
                  <th>Ketentuan</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>KDB Maksimum</td>
                  <td>60%</td>
                </tr>
                <tr>
                  <td>KLB Maksimum</td>
                  <td>18%</td>
                </tr>
                <tr>
                  <td>KTB Maksimum</td>
                  <td>60%</td>
                </tr>
                <tr>
                  <td>GSB Minimum</td>
                  <td>1X Rumija + Telajakan</td>
                </tr>
                <tr>
                  <td>Ketinggian Bangunan Maksimum</td>
                  <td>15 Meter</td>
                </tr>
                <tr>
                  <td>Keterangan</td>
                  <td>Basement maksimal 1 lantai</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}
