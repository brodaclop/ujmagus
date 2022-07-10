import { SebzesTipus } from "./Fegyver";

export interface PancelFit {
    nev: string;
    mgt: number;
}

export interface PancelMinoseg {
    nev: string;
    mgt: number;
    sfe: number;
}


/*
kontár
-1
+1
inas
0
+1
mester
0
0
udvari
0
-1
törp
+1
+1
*/

export const PANCEL_MINOSEGEK: Record<string, PancelMinoseg> = {
    kontar: {
        nev: 'kontár',
        sfe: -1,
        mgt: 1
    },
    inas: {
        nev: 'inas',
        sfe: 0,
        mgt: 1
    },
    mester: {
        nev: 'mester',
        sfe: 0,
        mgt: 0
    },
    nagymester: {
        nev: 'nagymester',
        sfe: 0,
        mgt: -1
    },
    torp: {
        nev: 'törp',
        sfe: 1,
        mgt: -1
    }
};

export const PANCEL_FITS: Record<string, PancelFit> = {
    semmi: {
        nev: '“csak úgy találtam”',
        mgt: 2
    },
    minimal: {
        nev: 'egydélutános barkács megoldás',
        mgt: 1
    },
    atlag: {
        nev: 'alapos tábori kiigazítás',
        mgt: 0
    },
    igazitott: {
        nev: 'méretre igazíttatás páncélkováccsal',
        mgt: -1
    },
    szabott: {
        nev: 'méretre készített',
        mgt: -2
    }
};

export interface Pancel {
    nev: string;
    fit: PancelFit;
    minoseg: PancelMinoseg;
    mgt: number;
    sfe: Record<SebzesTipus, number>;
}