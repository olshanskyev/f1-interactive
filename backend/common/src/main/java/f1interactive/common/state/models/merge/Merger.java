package f1interactive.common.state.models.merge;

import org.jspecify.annotations.NonNull;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;

public class Merger {
    public static void mergeAllNotNull(@NonNull Object to, @NonNull Object from) {
        if(!to.getClass().equals(from.getClass())){
            throw new RuntimeException("Objects have different classes");
        }
        Field[] fields = from.getClass().getFields();
        for(Field field: fields){
            try {
                Class<?> type = field.getType();
                if (Arrays.asList( // used primitive types
                                String.class,
                                Boolean.class,
                                Integer.class,
                                Date.class)
                        .contains(type)) {
                    Object fromValue = field.get(from);
                    if (fromValue != null) {
                        field.set(to, fromValue);
                    }
                } else {
                    if (type.isAssignableFrom(LinkedHashMap.class) || type.isAssignableFrom(HashMap.class)) {
                        HashMap<Object, Object> fromMap = (HashMap<Object, Object>)field.get(from);
                        HashMap<Object, Object> toMap = (HashMap<Object, Object>)field.get(to);

                        fromMap.forEach((key, mapItemFrom) -> {
                            Object mapItemTo = toMap.get(key);
                            if (mapItemTo != null) {
                                mergeAllNotNull(mapItemTo, mapItemFrom);
                            } else {
                                toMap.put(key, mapItemFrom);
                            }
                        });

                    } else { // custom class
                        Object fromValue = field.get(from);
                        if (fromValue != null)
                           mergeAllNotNull(field.get(to), fromValue);
                    }
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
