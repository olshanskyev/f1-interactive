export function areMapKeySequencesEqual<K, V1, V2>(map1: Map<K, V1>, map2: Map<K, V2>): boolean {
    if (map1.size !== map2.size) return false;

    const keys1 = map1.keys();
    const keys2 = map2.keys();

    for (let i = 0; i < map1.size; i++) {
        const k1 = keys1.next().value;
        const k2 = keys2.next().value;
        if (k1 !== k2) return false;
    }
    return true;
}

export function calculateSequenceChanges<V>(
  oldPositions: Map<string, V>,
  newPositions: Map<string, V>
) {
    const oldKeys = Array.from(oldPositions.keys());
    const newKeys = Array.from(newPositions.keys());
    return (newKeys.reduce((acc, key, newIndex) => {
      const oldIndex = oldKeys.indexOf(key);
      let movement: 'up' | 'down' | null = null;
      if (oldIndex > newIndex) {
        movement = 'up';   // Moved toward index 0
      } else if (oldIndex !== -1 && (oldIndex < newIndex)) {
        movement = 'down'; // Moved toward the end
      }
      acc[key] = movement;
      return acc;
    }, {} as Record<string, 'up' | 'down' | null>));
}

// ToDo not used, remove?
export function convertObjectIntoSortedArray<V>(object: Record<number | string, V>): V[] {
    return Object.entries(object).sort(([a, ],[b, ]) => (+a) - (+b)).map(value => value[1]);
}

export function getLastNummericItem<V>(object: Record<number | string, V>): V {
    return object[Object.keys(object).length - 1];
}
