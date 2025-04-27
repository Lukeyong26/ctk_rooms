import RoomCard from "../components/RoomCard";

export default function Home() {

  return (
    <div className="w-full">
      <RoomCard imageUrl={"https://thumbs.dreamstime.com/b/office-room-7881663.jpg"} title={"Room 301"} onBook={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  );

}
