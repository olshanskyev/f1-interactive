package f1interactive.server.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StringArrayConverter implements AttributeConverter<String[], String> {
    @Override
    public String convertToDatabaseColumn(String[] array) {
        if (array == null) return "";
        return String.join(",", array);
    }

    @Override
    public String[] convertToEntityAttribute(String joined) {
        if (joined == null || joined.isEmpty()) return new String[0];
        return joined.split(",");
    }
}
