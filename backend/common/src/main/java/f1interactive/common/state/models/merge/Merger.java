package f1interactive.common.state.models.merge;

import f1interactive.common.state.models.ArrayWrapper;
import org.jspecify.annotations.NonNull;

import java.lang.reflect.Field;
import java.util.*;

public class Merger {

    public static <K, V> LinkedHashMap<K, V> copyMapValues(LinkedHashMap<K,V> from, LinkedHashMap<K,V> to) {
        if (from == null) return to;
        if (to == null) to = new LinkedHashMap<>();
        if (from.isEmpty()) to.clear();
        else to.putAll(from);

        return to;
    }

    private static boolean isPrimitive(Class<?> type) {
        return Arrays.asList( // used primitive types
                        String.class,
                        Boolean.class,
                        Integer.class,
                        Date.class)
                .contains(type);
    }

    public static void mergeAllNotNull(@NonNull Object to, @NonNull Object from) {
        if(!to.getClass().equals(from.getClass())){
            throw new RuntimeException("Objects have different classes");
        }
        Field[] fields = from.getClass().getFields();
        for(Field field: fields){
            try {
                Class<?> type = field.getType();
                if (isPrimitive(type)) {
                    Object fromValue = field.get(from);
                    if (fromValue != null) {
                        field.set(to, fromValue);
                    }
                } else {
                    if (type.equals(ArrayWrapper.class)) {
                        ArrayWrapper wrapper = (ArrayWrapper<Object, Object>)field.get(from);
                        if (wrapper.fullState == true) { // clear existing
                            field.set(to, new ArrayWrapper<>());
                        }
                    }
                    if (type.isAssignableFrom(LinkedHashMap.class) || type.isAssignableFrom(HashMap.class)) {
                        HashMap<Object, Object> fromMap = (HashMap<Object, Object>)field.get(from);
                        HashMap<Object, Object> toMap = (HashMap<Object, Object>)field.get(to);
                        if (fromMap != null) {
                            if (toMap == null) {
                                toMap = new LinkedHashMap<>();
                                field.set(to, toMap);
                            }
                            if (fromMap.isEmpty())
                                toMap.clear();
                            else { // copy elements
                                for (Map.Entry<Object, Object> entry: fromMap.entrySet()) {
                                    Object mapItemTo = toMap.get(entry.getKey());
                                    Object entryValue = entry.getValue();
                                    Class<?> entryType = entryValue.getClass();
                                    if (mapItemTo != null && !isPrimitive(entryType)) {
                                        mergeAllNotNull(mapItemTo, entryValue);
                                    } else {
                                        toMap.put(entry.getKey(), entryValue);
                                    }
                                }
                            }
                        }

                    } else { // custom class
                        Object fromValue = field.get(from);
                        Object toValue = field.get(to);
                        if (fromValue != null) {
                            if (toValue == null)
                                field.set(to, fromValue);
                            else
                                mergeAllNotNull(field.get(to), fromValue);
                        }
                    }
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
