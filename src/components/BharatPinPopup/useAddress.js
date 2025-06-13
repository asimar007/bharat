import { useQuery } from "@tanstack/react-query";

const fetchAddress = async ({ queryKey }) => {
  const [_key, { lat, lng }] = queryKey;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
  );
  if (!response.ok) throw new Error("Failed to fetch address");
  const data = await response.json();
  return data.address;
};

export function useAddress(lat, lng) {
  return useQuery({
    queryKey: ["address", { lat, lng }],
    queryFn: fetchAddress,
    refetchOnWindowFocus: false,
    enabled: !!lat && !!lng,
  });
}
