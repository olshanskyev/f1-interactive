package f1interactive.common.state;

import com.fasterxml.jackson.databind.ObjectMapper;
import f1interactive.common.state.models.*;
import f1interactive.common.state.models.deserializer.EventsParser;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class StateHandlerTest {

    static class CompareException extends Exception {
        CompareException(String fieldName, String expected, String actual) {
            super("[" + fieldName + "] expected: " + expected + " actual: " + actual);
        }
        CompareException(String message) {
            super(message);
        }
    }

    private void compareAllFields(Object expected, Object actual, HashMap<Class<?>, List<String>> ignoreClasses) throws CompareException {
        if (expected == null && actual == null)
            return;

        if (!(expected != null && actual != null)) { // one of is null
            throw new CompareException("One of comparable object is null");
        }
        if(!expected.getClass().equals(actual.getClass())){
            throw new RuntimeException("Objects have different classes");
        }
        List<String> ignoreFields = ignoreClasses.get(expected.getClass());
        Field[] fields = actual.getClass().getFields();
        for(Field field: fields){
            try {
                if (ignoreFields != null && (ignoreFields.contains(field.getName()) || ignoreFields.contains("*"))) {
                    return;
                }
                Class<?> type = field.getType();
                if (Arrays.asList( // used primitive types
                                String.class,
                                Boolean.class,
                                Integer.class,
                                Date.class)
                        .contains(type)) {
                    Object expectedValue = field.get(expected);
                    Object actualValue = field.get(actual);
                    if (expectedValue != null && actualValue != null) {
                        if (!expectedValue.equals(actualValue)) {
                            throw new CompareException(expected.getClass() + ":" + field.getName(), expectedValue.toString(), actualValue.toString());
                        }
                    } else {
                        if (!(expectedValue == null && actualValue == null)) {
                            throw new CompareException(expected.getClass() + ":" + field.getName(),
                                    (expectedValue != null) ? expectedValue.toString() : "null",
                                    (actualValue != null) ? actualValue.toString() : "null");
                        }
                    }
                } else {
                    if (type.isAssignableFrom(LinkedHashMap.class) || type.isAssignableFrom(HashMap.class)) {
                        HashMap<Object, Object> expectedMap = (HashMap<Object, Object>)field.get(expected);
                        HashMap<Object, Object> actualMap = (HashMap<Object, Object>)field.get(actual);

                        for (Object key : actualMap.keySet()) {
                            compareAllFields(expectedMap.get(key), actualMap.get(key), ignoreClasses);
                        }

                    } else { // custom class
                        compareAllFields(field.get(expected), field.get(actual), ignoreClasses);
                    }
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Test
    public void stateHandlerTest() throws IOException {
        StateHandler stateHandler = new StateHandler();
        ObjectMapper mapper = new ObjectMapper();
        Root initMessage = mapper.readValue(new File("src\\test\\resources\\mergingTestData\\savedSessions\\initialStateBeforeRace.json"), Root.class);
        stateHandler.init(initMessage);
        try (Scanner scanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\savedSessions\\1stLapUpdates.txt"))) {
            while (scanner.hasNextLine()) {
                String event = scanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(event);
                assertNotNull(updateEvent);
                stateHandler.updateState(updateEvent);
            }
        }
        Root expectedState = mapper.readValue(new File("src\\test\\resources\\mergingTestData\\savedSessions\\initialStateLap2.json"), Root.class);
        Root actualState = stateHandler.getState();

        HashMap<Class<?>, List<String>> exceptions = new HashMap<>();
        exceptions.put(ExtrapolatedClock.class, List.of("*"));
        exceptions.put(TopThree.class, List.of("_kf"));
        exceptions.put(TimingStats.class, List.of("_kf"));
        exceptions.put(TimingAppData.class, List.of("_kf"));
        exceptions.put(SessionData.class, List.of("_kf"));
        exceptions.put(LapCount.class, List.of("_kf"));
        exceptions.put(TimingData.class, List.of("_kf"));
        assertDoesNotThrow(() -> compareAllFields(expectedState, actualState, exceptions));


    }
}
