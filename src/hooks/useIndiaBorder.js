import { useQuery } from "@tanstack/react-query";

const fetchIndiaBorder = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch India border GeoJSON");
  }
  return response.json();
};

export const useIndiaBorder = () =>
  useQuery({
    queryKey: ["indiaBorder"],
    queryFn: fetchIndiaBorder,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
