import { useMemo } from 'react';
import { format, intervalToDuration, isBefore, setYear } from 'date-fns';
import useCustomer from '@/hooks/useCustomer';

export default function usePetEvents() {
  const { data, error } = useCustomer();

  return useMemo(() => {
    if (!data || error) {
      return [];
    }

    const { pets = [] } = data;

    const upcomingEvents = [];

    const start = new Date();
    for (const pet of pets) {
      if (!pet?.adoptionDate && !pet?.birthday) continue;
      const end = setYear(
        new Date(pet?.adoptionDate ? pet.adoptionDate : pet.birthday),
        start.getFullYear(),
      );
      if (isBefore(end, start)) continue;
      const durationToBirthday = intervalToDuration({ start, end });
      if (
        durationToBirthday?.years === 0 &&
        durationToBirthday?.months === 0 &&
        durationToBirthday?.days < 15
      ) {
        upcomingEvents.push({
          id: `${pet.id}-celebration`,
          date: format(end, 'MMM do'),
          daysUntil: durationToBirthday?.days,
          title: `${pet?.name}'s ${pet?.adopted ? 'adoption day' : 'birthday'}`,
        });
      }
    }

    return upcomingEvents;
  }, [data, error]);
}
