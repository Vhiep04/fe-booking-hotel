export function useFacilityTranslation() {
  const { t, te } = useI18n();

  function translateFacility(name: string): string {
    const key = `facility.${name}`;
    return te(key) ? t(key) : name;
  }

  return { translateFacility };
}

export function useRoomTypeTranslation() {
  const { t, te } = useI18n();

  function translateRoomType(name: string): string {
    const key = `roomType.${name}`;
    return te(key) ? t(key) : name;
  }

  return { translateRoomType };
}
