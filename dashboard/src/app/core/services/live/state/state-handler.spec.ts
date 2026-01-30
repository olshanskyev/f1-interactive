import { Root } from '@core/types/f1types';
import { describe, expect, it, beforeEach } from 'vitest';
import { UpdateEventRecord } from '../live.service';
import { StateHandler } from './state-handler';

describe('StateHandler', () => {
    let stateHandler: StateHandler;
    const initState: Root = {
        ExtrapolatedClock: {
            Extrapolating: false,
			Remaining: '01:00:00',
			Utc: '2025-12-05T09:28:49.438Z',
        },
        RaceControlMessages: {
			Messages: {
				0: {
					Category: 'Other',
					Flag: 'CLEAR',
					Lap: 0,
					Message: 'RISK OF RAIN FOR F1 FIRST PRACTICE SESSION IS 10%',
					Mode: '',
					RacingNumber: '',
					Scope: 'Sector',
					Sector: 0,
					Status: 'ENABLED',
					Utc: '2025-12-05T09:16:40.000Z'
				}
			}
		},
        TimingAppData: {
            Lines: {
                0 : {
                    RacingNumber: '1',
                    Line: 1,
                    GridPos: '2',
                    Stints: {}
                }
            }
        }
    };

    beforeEach(() => {
        stateHandler = new StateHandler();
        stateHandler.init(initState);
    });

    it('should be created', () => {
        expect(stateHandler).toBeTruthy();
    });

    it('should merge if target field is undefined', () => {
        const updateWeatherData: UpdateEventRecord = {
            className: 'WeatherData',
            updateEvent: {
                AirTemp: '27.3'
            },
            utc: '2025-12-07T12:35:07.32Z'
        };
        stateHandler.updateState(updateWeatherData);
        expect(stateHandler.fullStateSignal()?.WeatherData).toBe(updateWeatherData.updateEvent);
        expect(stateHandler.fullStateSignal()?.ExtrapolatedClock?.Remaining).toBe('01:00:00');
    });

    it('should update existing root level', () => {
        const updateExtrapolatinClock: UpdateEventRecord = {
            className: 'ExtrapolatedClock',
            updateEvent: {
                Utc: '2025-12-07T13:03:28.008Z',
                Remaining: '01:59:59',
                Extrapolating: 'true'
            },
            utc: '2025-12-07T12:35:07.32Z'
        };
        stateHandler.updateState(updateExtrapolatinClock);
        expect(stateHandler.fullStateSignal()?.ExtrapolatedClock)
            .toStrictEqual(updateExtrapolatinClock.updateEvent);
    });

    it('should update list', () => {
        const updateRaceControlMessage: UpdateEventRecord = {
            className: 'RaceControlMessages',
            updateEvent: {
                Messages: {
                    1: {
                        Category: 'Other',
                        Lap: 1,
                        Message: 'RISK OF RAIN FOR F1 RACE IS 0%',
                        Utc: '2025-12-07T12:45:02.000Z'
				    }
                }
            },
            utc: '2025-12-07T12:35:07.32Z'
        };
        stateHandler.updateState(updateRaceControlMessage);
        const expectedMessage = initState.RaceControlMessages?.Messages['0'];
        const actualMessage = stateHandler.fullStateSignal()?.RaceControlMessages?.Messages['0'];
        expect(actualMessage).toBe(expectedMessage);
        const expectedMessage1 = updateRaceControlMessage.updateEvent.Messages['1'];
        expect(stateHandler.fullStateSignal()?.RaceControlMessages?.Messages['1'])
            .toBe(expectedMessage1);
    });


    it('should update existing in list', () => {
        const updateRaceControlMessage: UpdateEventRecord = {
            className: 'RaceControlMessages',
            updateEvent: {
                Messages: {
                    0: {
                        Category: 'Other',
                        Lap: 1,
                        Message: 'RISK OF RAIN FOR F1 RACE IS 0%',
                        Utc: '2025-12-07T12:45:02.000Z'
				    }
                }
            },
            utc: '2025-12-07T12:35:07.32Z'
        };
        stateHandler.updateState(updateRaceControlMessage);
        expect(stateHandler.fullStateSignal()?.RaceControlMessages?.Messages['0'])
            .containSubset({...updateRaceControlMessage.updateEvent.Messages['0']});
    });

    it('should call update signal', () => {
        const updateWeatherData: UpdateEventRecord = {
            className: 'WeatherData',
            updateEvent: {
                AirTemp: '27.3'
            },
            utc: '2025-12-07T12:35:07.32Z'
        };

        // create new sub element
        stateHandler.updateState(updateWeatherData);
        const weatherSignal = stateHandler.updateSignals['WeatherData']!;
        expect(weatherSignal()).not.toBe(updateWeatherData.updateEvent); // check new elem created
        expect(weatherSignal()).toStrictEqual(updateWeatherData.updateEvent); // but exact the same
        // update existing
        updateWeatherData.updateEvent = {AirTemp: '27.4', Humidity:'44.0'};
        stateHandler.updateState(updateWeatherData);
        expect(weatherSignal()).toStrictEqual(updateWeatherData.updateEvent);
    });

    it('should call update signal after init', () => {
        expect(stateHandler.fullStateSignal()!).toBe(initState);
        expect(stateHandler.updateSignals['TimingAppData']()).toBe(initState.TimingAppData);
    });

});