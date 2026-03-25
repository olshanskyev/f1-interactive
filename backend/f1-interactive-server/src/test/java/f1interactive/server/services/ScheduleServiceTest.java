package f1interactive.server.services;

import f1interactive.server.models.Round;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class ScheduleServiceTest {

    @Spy
    @InjectMocks
    private ScheduleService scheduleService;

    @Test
    public void testGetSchedule() throws Exception {
        InputStream mockStream = new ClassPathResource("Formula_1.ics").getInputStream();
        doReturn(mockStream).when(scheduleService).getIcalInputStream();
        List<Round> schedule = scheduleService.getSchedule(2026);
        assertNotNull(schedule);
        assertEquals(26, schedule.size());
        assertEquals(2, schedule.stream().filter(round -> round.getCountryName().equals("Spain")).count());
        assertEquals("Practice 3", schedule.get(0).getSessions().get(0).getKind());
        assertEquals(3, schedule.get(1).getSessions().size());
    }
}