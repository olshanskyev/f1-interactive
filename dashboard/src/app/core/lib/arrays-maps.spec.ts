import { describe, expect, it } from 'vitest';
import { convertObjectIntoSortedArray, getLastNummericItem } from './arrays-maps';

describe('Arrays and maps tests', () => {
    const stints: Record<number, any> = {
        0: {LapFlags:0,Compound:'SOFT',New:'true',TyresNotChanged:'0',TotalLaps:0,StartLaps:0},
        2: {LapFlags:0,Compound:'MEDIUM',New:'true',TyresNotChanged:'0',TotalLaps:0,StartLaps:0},
        1: {LapFlags:0,Compound:'HARD',New:'true',TyresNotChanged:'0',TotalLaps:0,StartLaps:0}
    };

    const stints2: Record<number, any> = {
        0: {LapFlags:0,Compound:'SOFT',New:'true',TyresNotChanged:'0',TotalLaps:0,StartLaps:0},
        2: {LapFlags:0,Compound:'MEDIUM',New:'true',TyresNotChanged:'0',TotalLaps:0,StartLaps:0},
        1: {LapFlags:0,Compound:'HARD',New:'true',TyresNotChanged:'0',TotalLaps:0,StartLaps:0}
    };

    it('should create array from map', () => {
        const result = convertObjectIntoSortedArray(stints);
        expect(result[result.length - 1].Compound).toBe('MEDIUM');
        expect(result[0].Compound).toBe('SOFT');
    });

    it('should get last element from nummeric object', () => {
        let result = getLastNummericItem(stints);
        expect(result.Compound).toBe('MEDIUM');
        result = getLastNummericItem(stints2);
        expect(result.Compound).toBe('MEDIUM');
    });

});