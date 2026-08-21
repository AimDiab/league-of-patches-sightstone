const CHAMPION_ID_OVERRIDES: Record<string, string> = {
  Wukong: "MonkeyKing",
  "Nunu & Willump": "Nunu",
  "Renata Glasc": "Renata",
};

export function getChampionIconSrc(championName: string): string {
  const id =
    CHAMPION_ID_OVERRIDES[championName] ?? championName.replace(/[^a-zA-Z0-9]/g, "");
  return `/champions/icons/${id}.png`;
}
