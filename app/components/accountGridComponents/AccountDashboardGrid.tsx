import SavedFlightsList from "./SavedFlightsList";
import type { SavedFlightData } from "./SavedFlightsList";

export default function AccountDashboardGrid({
  initialFlights,
}: {
  initialFlights: SavedFlightData[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-4 gap-4">
      {/* Right-hand column on md+, last section on mobile */}
      <div className="order-last md:col-start-2 lg:col-start-3 lg:row-start-1 lg:row-end-3 xl:col-start-4">
        <SavedFlightsList initialFlights={initialFlights} />
      </div>

      {/* Other tiles (total saved, airlines tracked, currently airborne, etc.)
          slot in here as siblings once built */}
    </div>
  );
}