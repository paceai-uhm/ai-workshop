/**
 * Seed data for the filter & sort demo. Versioned in the repo on purpose:
 * the workshop rule is that seed data is code you can re-run and review, not
 * rows somebody typed into a dashboard once and cannot reproduce.
 *
 * 40 reef fish found around Oʻahu. Lengths are typical adult length in cm.
 */
export type Fish = {
  id: number;
  name: string;
  hawaiian: string;
  zone: "Tide pool" | "Reef flat" | "Deep reef";
  diet: "Herbivore" | "Carnivore" | "Omnivore";
  lengthCm: number;
};

export const ZONES: Fish["zone"][] = ["Tide pool", "Reef flat", "Deep reef"];
export const DIETS: Fish["diet"][] = ["Herbivore", "Carnivore", "Omnivore"];

export const FISH: Fish[] = [
  { id: 1, name: "Reef triggerfish", hawaiian: "Humuhumunukunukuāpuaʻa", zone: "Reef flat", diet: "Omnivore", lengthCm: 25 },
  { id: 2, name: "Yellow tang", hawaiian: "Lauʻīpala", zone: "Reef flat", diet: "Herbivore", lengthCm: 20 },
  { id: 3, name: "Moorish idol", hawaiian: "Kihikihi", zone: "Reef flat", diet: "Omnivore", lengthCm: 23 },
  { id: 4, name: "Bluestripe snapper", hawaiian: "Taʻape", zone: "Deep reef", diet: "Carnivore", lengthCm: 30 },
  { id: 5, name: "Whitemouth moray", hawaiian: "Puhi ʻōniʻo", zone: "Reef flat", diet: "Carnivore", lengthCm: 100 },
  { id: 6, name: "Convict tang", hawaiian: "Manini", zone: "Reef flat", diet: "Herbivore", lengthCm: 18 },
  { id: 7, name: "Achilles tang", hawaiian: "Pākuʻikuʻi", zone: "Reef flat", diet: "Herbivore", lengthCm: 24 },
  { id: 8, name: "Ornate butterflyfish", hawaiian: "Kīkākapu", zone: "Reef flat", diet: "Carnivore", lengthCm: 20 },
  { id: 9, name: "Raccoon butterflyfish", hawaiian: "Kīkākapu", zone: "Reef flat", diet: "Omnivore", lengthCm: 20 },
  { id: 10, name: "Saddle wrasse", hawaiian: "Hīnālea lauwili", zone: "Reef flat", diet: "Carnivore", lengthCm: 28 },
  { id: 11, name: "Christmas wrasse", hawaiian: "ʻAwela", zone: "Tide pool", diet: "Carnivore", lengthCm: 30 },
  { id: 12, name: "Rockmover wrasse", hawaiian: "Iao", zone: "Deep reef", diet: "Carnivore", lengthCm: 30 },
  { id: 13, name: "Stripebelly puffer", hawaiian: "ʻOpu hue", zone: "Deep reef", diet: "Carnivore", lengthCm: 40 },
  { id: 14, name: "Spotted boxfish", hawaiian: "Moa", zone: "Reef flat", diet: "Omnivore", lengthCm: 16 },
  { id: 15, name: "Flame angelfish", hawaiian: "—", zone: "Deep reef", diet: "Omnivore", lengthCm: 10 },
  { id: 16, name: "Potter's angelfish", hawaiian: "—", zone: "Deep reef", diet: "Herbivore", lengthCm: 10 },
  { id: 17, name: "Milletseed butterflyfish", hawaiian: "Lauwiliwili", zone: "Reef flat", diet: "Omnivore", lengthCm: 15 },
  { id: 18, name: "Threadfin butterflyfish", hawaiian: "Kīkākapu", zone: "Reef flat", diet: "Omnivore", lengthCm: 18 },
  { id: 19, name: "Bullethead parrotfish", hawaiian: "Uhu", zone: "Reef flat", diet: "Herbivore", lengthCm: 40 },
  { id: 20, name: "Stareye parrotfish", hawaiian: "Uhu ʻuliʻuli", zone: "Deep reef", diet: "Herbivore", lengthCm: 50 },
  { id: 21, name: "Bigeye emperor", hawaiian: "Mū", zone: "Deep reef", diet: "Carnivore", lengthCm: 60 },
  { id: 22, name: "Bluefin trevally", hawaiian: "ʻŌmilu", zone: "Deep reef", diet: "Carnivore", lengthCm: 80 },
  { id: 23, name: "Giant trevally", hawaiian: "Ulua aukea", zone: "Deep reef", diet: "Carnivore", lengthCm: 120 },
  { id: 24, name: "Hawaiian dascyllus", hawaiian: "ʻĀlo ʻilo ʻi", zone: "Reef flat", diet: "Omnivore", lengthCm: 8 },
  { id: 25, name: "Sergeant major", hawaiian: "Mamo", zone: "Reef flat", diet: "Omnivore", lengthCm: 18 },
  { id: 26, name: "Blackspot sergeant", hawaiian: "Kūpīpī", zone: "Tide pool", diet: "Omnivore", lengthCm: 20 },
  { id: 27, name: "Zebra blenny", hawaiian: "Pāoʻo", zone: "Tide pool", diet: "Herbivore", lengthCm: 18 },
  { id: 28, name: "Marbled shrimp goby", hawaiian: "—", zone: "Tide pool", diet: "Carnivore", lengthCm: 9 },
  { id: 29, name: "Hawaiian flagtail", hawaiian: "Āholehole", zone: "Tide pool", diet: "Carnivore", lengthCm: 30 },
  { id: 30, name: "Hawaiian sergeant", hawaiian: "Mamo", zone: "Reef flat", diet: "Omnivore", lengthCm: 17 },
  { id: 31, name: "Peacock grouper", hawaiian: "Roi", zone: "Deep reef", diet: "Carnivore", lengthCm: 50 },
  { id: 32, name: "Goldring surgeonfish", hawaiian: "Kole", zone: "Reef flat", diet: "Herbivore", lengthCm: 18 },
  { id: 33, name: "Orangespine unicornfish", hawaiian: "Umaumalei", zone: "Reef flat", diet: "Herbivore", lengthCm: 45 },
  { id: 34, name: "Bluespine unicornfish", hawaiian: "Kala", zone: "Reef flat", diet: "Herbivore", lengthCm: 60 },
  { id: 35, name: "Yellowfin goatfish", hawaiian: "Weke ʻula", zone: "Deep reef", diet: "Carnivore", lengthCm: 35 },
  { id: 36, name: "Manybar goatfish", hawaiian: "Moano", zone: "Reef flat", diet: "Carnivore", lengthCm: 30 },
  { id: 37, name: "Hawaiian cleaner wrasse", hawaiian: "—", zone: "Deep reef", diet: "Carnivore", lengthCm: 10 },
  { id: 38, name: "Pyramid butterflyfish", hawaiian: "—", zone: "Deep reef", diet: "Omnivore", lengthCm: 18 },
  { id: 39, name: "Spotted eagle ray", hawaiian: "Hīhīmanu", zone: "Deep reef", diet: "Carnivore", lengthCm: 200 },
  { id: 40, name: "Whitetip reef shark", hawaiian: "Manō lālākea", zone: "Deep reef", diet: "Carnivore", lengthCm: 160 },
];
