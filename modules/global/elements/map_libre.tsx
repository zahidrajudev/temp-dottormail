// import { useEffect, useRef } from "react";
// import maplibregl, { Map, Marker, Popup, NavigationControl } from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";

// interface Office {
//   id: number;
//   country: string;
//   lat: number;
//   lng: number;
//   flag: string;
// }

// interface MapLibreMapProps {
//   zoom?: number;
//   center?: [number, number];
// }

// // const offices: Office[] = [
// //   { id: 1, country: "USA", lat: 39.65328754038519, lng: -100.98919835853411, flag: "/gmn_images/brands/flag/usa.png" },
// //   { id: 2, country: "UK", lat: 55.08376224875042, lng: -3.0460790332364813, flag: "/gmn_images/brands/flag/uk.png" },
// //   { id: 3, country: "Germany", lat: 51.05689460103355, lng: 10.36241813839203, flag: "/gmn_images/brands/flag/germany.png" },
// //   { id: 4, country: "UAE", lat: 24.49835075012295, lng: 54.57388461250465, flag: "/gmn_images/brands/flag/uae.png" },
// //   { id: 5, country: "Swiss", lat: 46.836259985224935, lng: 7.913174407419877, flag: "/gmn_images/brands/flag/swiss.png" },
// //   { id: 6, country: "Austria", lat: 47.562491976874746, lng: 14.189677102444955, flag: "/gmn_images/brands/flag/austria.png" },
// //   { id: 7, country: "Australia", lat: -25.05167913481174, lng: 134.91634616877417, flag: "/gmn_images/brands/flag/australia.png" },
// // ];

// const offices: Office[] = [
//   { id: 1, country: "USA", lat: 39.65328754038519, lng: -100.98919835853411, flag: "/gmn_images/brands/flag/usa.png" },
//   { id: 2, country: "UK", lat: 55.08376224875042, lng: -3.0460790332364813, flag: "/gmn_images/brands/flag/uk.png" },
//   { id: 3, country: "Germany", lat: 51.05689460103355, lng: 10.36241813839203, flag: "/gmn_images/brands/flag/germany.png" },
//   { id: 4, country: "UAE", lat: 24.49835075012295, lng: 54.57388461250465, flag: "/gmn_images/brands/flag/uae.png" },
//   { id: 5, country: "Swiss", lat: 46.836259985224935, lng: 7.913174407419877, flag: "/gmn_images/brands/flag/swiss.png" },
//   { id: 6, country: "Austria", lat: 47.562491976874746, lng: 14.189677102444955, flag: "/gmn_images/brands/flag/austria.png" },
//   { id: 7, country: "Australia", lat: -25.05167913481174, lng: 134.91634616877417, flag: "/gmn_images/brands/flag/australia.png" },
//   {
//     id: 8,
//     country: "Australia",
//     lat: -25.2744,
//     lng: 133.7751,
//     flag: "/flags/Australia.png",
//   },
//   {
//     id: 9,
//     country: "Kenya",
//     lat: -0.0236,
//     lng: 37.9062,
//     flag: "/flags/Kenya.png",
//   },
//   {
//     id: 10,
//     country: "Nigeria",
//     lat: 9.082,
//     lng: 8.6753,
//     flag: "/flags/nigeria.png",
//   },
//   {
//     id: 11,
//     country: "South Africa",
//     lat: -30.5595,
//     lng: 22.9375,
//     flag: "/flags/South-africa.png",
//   },
//   {
//     id: 12,
//     country: "United States",
//     lat: 37.0902,
//     lng: -95.7129,
//     flag: "/flags/US.png",
//   },
//   {
//     id: 13,
//     country: "Bangladesh",
//     lat: 23.685,
//     lng: 90.3563,
//     flag: "/flags/Bangladesh.png",
//   },
//   {
//     id: 14,
//     country: "Ethiopia",
//     lat: 9.145,
//     lng: 40.4897,
//     flag: "/flags/Ethiopia.png",
//   },
//   {
//     id: 15,
//     country: "Liberia",
//     lat: 6.4281,
//     lng: -9.4295,
//     flag: "/flags/Liberia.png",
//   },
//   {
//     id: 16,
//     country: "Pakistan",
//     lat: 30.3753,
//     lng: 69.3451,
//     flag: "/flags/Pakistan.png",
//   },
//   {
//     id: 17,
//     country: "Tanzania",
//     lat: -6.369,
//     lng: 34.8888,
//     flag: "/flags/Tanzania.png",
//   },
//   {
//     id: 18,
//     country: "Zimbabwe",
//     lat: -19.0154,
//     lng: 29.1549,
//     flag: "/flags/Zimbabwe.png",
//   },
//   {
//     id: 19,
//     country: "Barbados",
//     lat: 13.1939,
//     lng: -59.5432,
//     flag: "/flags/Barbados.png",
//   },
//   {
//     id: 20,
//     country: "Ghana",
//     lat: 7.9465,
//     lng: -1.0232,
//     flag: "/flags/Ghana.png",
//   },
//   {
//     id: 21,
//     country: "Malawi",
//     lat: -13.2543,
//     lng: 34.3015,
//     flag: "/flags/Malawi.png",
//   },
//   {
//     id: 22,
//     country: "Philippines",
//     lat: 12.8797,
//     lng: 121.774,
//     flag: "/flags/Philippines.png",
//   },
//   {
//     id: 23,
//     country: "Trinidad and Tobago",
//     lat: 10.6918,
//     lng: -61.2225,
//     flag: "/flags/Trinidad-and-Tobago.png",
//   },
//   {
//     id: 24,
//     country: "Belize",
//     lat: 17.1899,
//     lng: -88.4976,
//     flag: "/flags/Belize.png",
//   },
//   {
//     id: 25,
//     country: "India",
//     lat: 20.5937,
//     lng: 78.9629,
//     flag: "/flags/india.png",
//   },
//   {
//     id: 26,
//     country: "Malaysia",
//     lat: 4.2105,
//     lng: 101.9758,
//     flag: "/flags/Malaysia.png",
//   },
//   {
//     id: 27,
//     country: "Russia",
//     lat: 61.524,
//     lng: 105.3188,
//     flag: "/flags/Russia.png",
//   },
//   {
//     id: 28,
//     country: "Uganda",
//     lat: 1.3733,
//     lng: 32.2903,
//     flag: "/flags/Uganda.png",
//   },
//   {
//     id: 29,
//     country: "Canada",
//     lat: 56.1304,
//     lng: -106.3468,
//     flag: "/flags/Canada.png",
//   },
//   {
//     id: 30,
//     country: "Ireland",
//     lat: 53.4129,
//     lng: -8.2439,
//     flag: "/flags/Ireland.png",
//   },
//   {
//     id: 31,
//     country: "Namibia",
//     lat: -22.9576,
//     lng: 18.4904,
//     flag: "/flags/Namibia.png",
//   },
//   {
//     id: 32,
//     country: "Sierra Leone",
//     lat: 8.4605,
//     lng: -11.7799,
//     flag: "/flags/Sierra-Leone.png",
//   },
//   {
//     id: 33,
//     country: "Ukraine",
//     lat: 48.3794,
//     lng: 31.1656,
//     flag: "/flags/Ukraine.png",
//   },
//   {
//     id: 34,
//     country: "China",
//     lat: 35.8617,
//     lng: 104.1954,
//     flag: "/flags/China.png",
//   },
//   {
//     id: 35,
//     country: "Jamaica",
//     lat: 18.1096,
//     lng: -77.2975,
//     flag: "/flags/Jamaica.png",
//   },
//   {
//     id: 36,
//     country: "New Zealand",
//     lat: -40.9006,
//     lng: 174.886,
//     flag: "/flags/New-Zealand.png",
//   },
//   {
//     id: 37,
//     country: "Singapore",
//     lat: 1.3521,
//     lng: 103.8198,
//     flag: "/flags/Singapore.png",
//   },
//   {
//     id: 38,
//     country: "United Kingdom",
//     lat: 55.3781,
//     lng: -3.436,
//     flag: "/flags/United-kingdom.png",
//   },
// ];

// export default function MapLibreMap({ zoom = 1.9, center = [15, 30] }: MapLibreMapProps) {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<Map | null>(null);

//   // Helper: Create concentric circle marker
//   const createCustomMarker = (): HTMLDivElement => {
//     const el = document.createElement("div");
//     el.className = "cursor-pointer transition-transform hover:scale-110";
//     el.innerHTML = `
//       <div class="w-9 h-9 rounded-full bg-blue-500/20 flex justify-center items-center">
//         <div class="w-6 h-6 rounded-full bg-blue-500/30 flex justify-center items-center">
//           <div class="w-[6px] h-[6px] rounded-full bg-blue-500"></div>
//         </div>
//       </div>
//     `;
//     return el;
//   };

//   useEffect(() => {
//     if (!mapContainer.current || map.current) return;

//     map.current = new Map({
//       container: mapContainer.current,
//       style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=SpW2kAFblUCL1vnx6RCz",
//       center: center,
//       zoom: zoom,
//     });

//     // Add zoom controls
//     map.current.addControl(new NavigationControl());

//     map.current.on("style.load", () => {
//       if (!map.current) return;

//       // Hide all text labels
//       const layers = map.current.getStyle().layers;
//       layers.forEach((layer) => {
//         if (layer.type === "symbol") {
//           map.current?.setLayoutProperty(layer.id, "visibility", "none");
//         }
//       });

//       // Add custom markers
//       offices.forEach((office) => {
//         // Create popup with rounded-full container
//         const popup = new Popup({
//           closeButton: false,
//           closeOnClick: false,
//           offset: 25,
//           className: "",
//         }).setHTML(`
//           <div class="text-center bg-white rounded-full px-2 py-1.5 flex items-center gap-2 hover:scale-125 duration-500">
//             <div class="text-[12px] font-medium">${office.country}</div>
//             <img src="${office.flag}" class="size-4 rounded-full" />
//           </div>
//         `);

//         // Create marker with concentric circles
//         new Marker({
//           element: createCustomMarker(),
//         })
//           .setLngLat([office.lng, office.lat])
//           .setPopup(popup)
//           .addTo(map.current as Map)
//           .togglePopup();
//       });
//     });

//     return () => {
//       map.current?.remove();
//       map.current = null;
//     };
//   }, [center, zoom]);

//   return <div ref={mapContainer} className="w-full h-[203px] sm:h-[400px] md:h-[730px] rounded-lg overflow-hidden" aria-label="Office locations map" />;
// }
