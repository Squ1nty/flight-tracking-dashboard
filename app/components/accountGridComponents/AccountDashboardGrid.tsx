import SavedFlightsList from "./SavedFlightsList";
import type { SavedFlightData } from "./SavedFlightsList";

export default function AccountDashboardGrid({
  initialFlights,
}: {
  initialFlights: SavedFlightData[];
}) {
  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-6 xl:grid-rows-[125px_125px_1fr] gap-4">
      {/* Right-hand column on md+, last section on mobile */}
      <SavedFlightsList initialFlights={initialFlights} />

      {/* Other tiles (total saved, airlines tracked, currently airborne, etc.)
          slot in here as siblings once built */}
    </div>
  );
}