"use client";
import NavBar from "../components/navBar";
import TopBar from "../components/topBar";

export default function Home() {
  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title={"HOME"} />
        <main className="flex flex-1 items-center justify-center p-4 overflow-y-auto bg-gray-100">
          <div className="p-8"></div>
        </main>
      </div>
    </div>
  );
}
