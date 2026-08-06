import SavedFlightsList from "./SavedFlights/SavedFlightsList";
import type { SavedFlightData } from "./SavedFlights/SavedFlightsList";
import ProjectLogo from "./ProjectLogo";
import TotalTrackedFlights from "./TotalTrackedFlights";
import ProfileImage from "./ProfileImage";
import FavouriteAirline from "./FavouriteAirline";
import MiniMap from "./MiniMap";

export default function AccountDashboardGrid({
  initialFlights,
}: {
  initialFlights: SavedFlightData[];
}) {
  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 xl:px-16 xl:grid-cols-6 xl:grid-rows-[125px_125px_1fr] gap-4">
      {/* Right-hand column on md+, last section on mobile */}
      <ProjectLogo />
      <TotalTrackedFlights />
      <SavedFlightsList initialFlights={initialFlights} />
      <FavouriteAirline />
      <ProfileImage />
      <MiniMap />
    </div>
  );
}