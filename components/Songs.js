import { useRecoilValue } from "recoil";
import { selectionsState } from "../atoms/selectionsAtom";
import Song from "./Song"

export default function Songs() {
  const selections = useRecoilValue(selectionsState);

  return (
    <div className="pl-2 pr-8 flex flex-col space-y-1 pb-28 text-black">
      {selections?.map((item, i) => (
        <Song key={item !== null ? item.id : ""} track={item} order={i} />
      ))}
    </div>
  )
}
