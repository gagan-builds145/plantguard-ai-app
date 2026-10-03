import { toast } from "sonner";

/**
 * Shared handlers for the action buttons across role workspaces. They do
 * something real: open a map route, place a call, or read the device location
 * (with a visible fallback when permission is refused).
 */

/** Demo contact number used where the prototype has no real contact record. */
export const DEMO_CONTACT = "+919000000000";

export function openDirections(place: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function callContact(name: string) {
  toast.info(`Calling ${name}`, {
    description: `Demo contact number ${DEMO_CONTACT}`,
  });
  window.location.href = `tel:${DEMO_CONTACT}`;
}

export function useCurrentLocation(
  onLocated: (coords: { latitude: number; longitude: number }) => void,
  onError?: () => void,
) {
  if (!("geolocation" in navigator)) {
    onError?.();
    toast.error("This browser can't share a location.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      onLocated({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => {
      onError?.();
      toast.error("Location permission denied — enter your area manually.");
    },
    { enableHighAccuracy: true, timeout: 8000 },
  );
}
