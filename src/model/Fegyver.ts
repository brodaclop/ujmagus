import { Kepesseg } from "./Kepesseg";
import { DiceRoll, parseDiceRoll } from "./roll";

export type SebzesTipus = 'szuro' | 'vago' | 'zuzo';

export interface FegyverKategoria {
    id: string;
    nev: string;
    kepesseg: Kepesseg;
}

export interface FegyverBase {
    nev: string;
    tamperkor: number;
    sebzes: DiceRoll;
    sebzestipus: SebzesTipus | Array<SebzesTipus>;
    alapFegyver?: string;
}

export interface Kategorizalt {
    kategoria: FegyverKategoria;
    kepesseg?: undefined;
}

export interface NemKategorizalt {
    kategoria?: undefined;
    kepesseg: Kepesseg;
}

export interface KozelharcHarcertekek {
    ke: number;
    te: number;
    ve: number;
}

export type KozelharcFegyver = (Kategorizalt | NemKategorizalt) & FegyverBase & KozelharcHarcertekek;

export const FEGYVER_KATEGORIAK: Record<string, FegyverKategoria> = {
    szalfegyver: {
        id: 'szalfegyver',
        nev: 'Szál',
        kepesseg: 'ero'
    },
    egykezes_vago: {
        id: 'egykezes_vago',
        nev: 'Egykezes vágó',
        kepesseg: 'ugyesseg'
    },
    egykezes_szuro: {
        id: 'egykezes_szuro',
        nev: 'Egykezes szúró',
        kepesseg: 'gyorsasag'
    },
    zuzo: {
        id: 'zuzo',
        nev: 'Zúzó',
        kepesseg: 'ero'
    },
    dobo: {
        id: 'dobo',
        nev: 'Dobó',
        kepesseg: 'ugyesseg'
    },
    csatabard: {
        id: 'csatabard',
        nev: 'Csatabárd',
        kepesseg: 'ero'
    }
};
export const KOZELHARCI_FEGYVEREK: Array<KozelharcFegyver> = [
    {
        nev: 'Alabárd',
        kategoria: FEGYVER_KATEGORIAK.szalfegyver,
        tamperkor: 1 / 2,
        ke: 1,
        te: 14,
        ve: 15,
        sebzes: parseDiceRoll('2k6+2'),
        sebzestipus: 'vago'
    },
    {
        nev: 'Alabárd +1',
        kategoria: FEGYVER_KATEGORIAK.szalfegyver,
        tamperkor: 1 / 2,
        ke: 3,
        te: 19,
        ve: 20,
        sebzes: parseDiceRoll('2k6+3'),
        sebzestipus: 'vago',
        alapFegyver: 'Alabárd',
    },
    {
        nev: 'Béltépő',
        kategoria: FEGYVER_KATEGORIAK.egykezes_szuro,
        tamperkor: 2,
        ke: 10,
        te: 8,
        ve: 2,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: 'szuro'
    },
    {
        nev: 'Bola',
        kepesseg: 'ugyesseg',
        tamperkor: 1,
        ke: 2,
        te: 10,
        ve: 2,
        sebzes: parseDiceRoll('1k5'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Bot, furkós',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 2,
        te: 7,
        ve: 14,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Bot, hosszú',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 4,
        te: 10,
        ve: 16,
        sebzes: parseDiceRoll('1k5'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Bot, rövid',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 9,
        te: 9,
        ve: 17,
        sebzes: parseDiceRoll('1k3'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Buzogány, egykezes',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 7,
        te: 11,
        ve: 12,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Buzogány, kétkezes',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1 / 2,
        ke: 0,
        te: 7,
        ve: 6,
        sebzes: parseDiceRoll('3k6'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Buzogány, láncos',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 4,
        te: 13,
        ve: 11,
        sebzes: parseDiceRoll('1k6+3'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Buzogány, shadleki',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 8,
        te: 13,
        ve: 14,
        sebzes: parseDiceRoll('1k6+1'),
        sebzestipus: 'vago'
    },
    {
        nev: 'Buzogány, tollas',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 7,
        te: 12,
        ve: 13,
        sebzes: parseDiceRoll('1k6+1'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Buzogány, tüskés',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 7,
        te: 12,
        ve: 13,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: 'szuro'
    },
    {
        nev: 'Csatabárd, egykezes',
        kategoria: FEGYVER_KATEGORIAK.csatabard,
        tamperkor: 1,
        ke: 5,
        te: 12,
        ve: 11,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: 'vago'
    },
    {
        nev: 'Csatabárd, kétkezes',
        kategoria: FEGYVER_KATEGORIAK.csatabard,
        tamperkor: 1 / 2,
        ke: 0,
        te: 8,
        ve: 6,
        sebzes: parseDiceRoll('3k6'),
        sebzestipus: 'vago'
    },
    {
        nev: 'Csatacsákány',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1 / 2,
        ke: 5,
        te: 11,
        ve: 8,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: 'szuro'
    },
    {
        nev: 'Cséphadaró',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 1,
        te: 6,
        ve: 5,
        sebzes: parseDiceRoll('1k6+1'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Dárda',
        kategoria: FEGYVER_KATEGORIAK.szalfegyver,
        tamperkor: 1,
        ke: 8,
        te: 13,
        ve: 5,
        sebzes: parseDiceRoll('1k6+1'),
        sebzestipus: 'szuro'
    },
    {
        nev: 'Dobóháló',
        kepesseg: 'ugyesseg',
        tamperkor: 1 / 3,
        ke: 1,
        te: 8,
        ve: 4,
        sebzes: parseDiceRoll('0'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Domvik hadijogar',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 8,
        te: 11,
        ve: 12,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Dzsambia',
        kategoria: FEGYVER_KATEGORIAK.egykezes_szuro,
        tamperkor: 2,
        ke: 10,
        te: 8,
        ve: 4,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Garott',
        kepesseg: 'gyorsasag',
        tamperkor: 1,
        ke: 0,
        te: 5,
        ve: -20,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: 'vago'
    },
    {
        nev: 'Hajitóbárd',
        kategoria: FEGYVER_KATEGORIAK.dobo,
        tamperkor: 2,
        ke: 9,
        te: 10,
        ve: 4,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: 'vago'
    },
    {
        nev: 'Harcikalapács',
        kategoria: FEGYVER_KATEGORIAK.zuzo,
        tamperkor: 1,
        ke: 5,
        te: 8,
        ve: 10,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: 'zuzo'
    },
    {
        nev: 'Kard, dzsenn szablya',
        kepesseg: 'intelligencia',
        tamperkor: 1,
        ke: 9,
        te: 20,
        ve: 17,
        sebzes: parseDiceRoll('1k6+3'),
        sebzestipus: 'vago'
    },
    {
        nev: 'Kard, fejvadász',
        kepesseg: 'ugyesseg',
        tamperkor: 1,
        ke: 8,
        te: 16,
        ve: 16,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: ['vago', 'szuro']
    },
    {
        nev: 'Kard, handzsár',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 8,
        te: 14,
        ve: 15,
        sebzes: parseDiceRoll('1k6+3'),
        sebzestipus: ['vago', 'szuro']
    },
    {
        nev: 'Kard, hosszú',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 6,
        te: 14,
        ve: 16,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: ['vago', 'szuro']
    },
    {
        nev: 'Kard, jatagán',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 7,
        te: 14,
        ve: 14,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: ['vago']
    },
    {
        nev: 'Kard, kígyó',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 6,
        te: 14,
        ve: 15,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: ['vago']
    },
    {
        nev: 'Kard, lovagi',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 2,
        te: 10,
        ve: 7,
        sebzes: parseDiceRoll('2k6+2'),
        sebzestipus: ['vago']
    },
    {
        nev: 'Kard, másfélkezes',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 4,
        te: 13,
        ve: 12,
        sebzes: parseDiceRoll('2k6'),
        sebzestipus: ['vago', 'szuro']
    },
    {
        nev: 'Kard, pallos',
        kepesseg: 'ero',
        tamperkor: 1 / 2,
        ke: 0,
        te: 8,
        ve: 2,
        sebzes: parseDiceRoll('3k6+2'),
        sebzestipus: ['vago', 'szuro', 'zuzo']
    },
    {
        nev: 'Kard, rövid',
        kategoria: FEGYVER_KATEGORIAK.egykezes_szuro,
        tamperkor: 1,
        ke: 9,
        te: 12,
        ve: 14,
        sebzes: parseDiceRoll('1k6+1'),
        sebzestipus: ['vago', 'szuro']
    },
    {
        nev: 'Kard, Slan',
        kepesseg: 'ugyesseg',
        tamperkor: 1,
        ke: 8,
        te: 20,
        ve: 12,
        sebzes: parseDiceRoll('1k10+2'),
        sebzestipus: ['vago', 'szuro']
    },
    {
        nev: 'Kard, szablya',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 7,
        te: 15,
        ve: 17,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: ['vago']
    },
    {
        nev: 'Kés',
        kategoria: FEGYVER_KATEGORIAK.egykezes_szuro,
        tamperkor: 1,
        ke: 10,
        te: 4,
        ve: 0,
        sebzes: parseDiceRoll('1k5'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Kopja, könnyű',
        kategoria: FEGYVER_KATEGORIAK.szalfegyver,
        tamperkor: 1,
        ke: 2,
        te: 11,
        ve: 12,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Kopja, lovas',
        kategoria: FEGYVER_KATEGORIAK.szalfegyver,
        tamperkor: 1 / 2,
        ke: 1,
        te: 15,
        ve: 0,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Kopja, nehézlovas',
        kategoria: FEGYVER_KATEGORIAK.szalfegyver,
        tamperkor: 1 / 3,
        ke: 0,
        te: 15,
        ve: 0,
        sebzes: parseDiceRoll('2k10'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Korbács',
        kepesseg: 'ugyesseg',
        tamperkor: 1 / 2,
        ke: 4,
        te: 6,
        ve: 0,
        sebzes: parseDiceRoll('1k3'),
        sebzestipus: ['zuzo']
    },
    {
        nev: 'Lagoss',
        kepesseg: 'gyorsasag',
        tamperkor: 2,
        ke: 8,
        te: 14,
        ve: 14,
        sebzes: parseDiceRoll('1k6+4'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Lándzsa',
        kategoria: FEGYVER_KATEGORIAK.szalfegyver,
        tamperkor: 1,
        ke: 4,
        te: 12,
        ve: 12,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Lasszó',
        kepesseg: 'ugyesseg',
        tamperkor: 1 / 3,
        ke: 0,
        te: 1,
        ve: 0,
        sebzes: parseDiceRoll('0'),
        sebzestipus: ['zuzo']
    },
    {
        nev: 'Mara-sequor',
        kepesseg: 'ugyesseg',
        tamperkor: 1,
        ke: 7,
        te: 16,
        ve: 14,
        sebzes: parseDiceRoll('2k6+2'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Mesterkard',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 7,
        te: 16,
        ve: 14,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Ostor',
        kepesseg: 'ugyesseg',
        tamperkor: 2,
        ke: 3,
        te: 6,
        ve: 0,
        sebzes: parseDiceRoll('1k2'),
        sebzestipus: ['zuzo']
    },
    {
        nev: 'Predoci egyeneskard',
        kategoria: FEGYVER_KATEGORIAK.egykezes_vago,
        tamperkor: 1,
        ke: 7,
        te: 16,
        ve: 15,
        sebzes: parseDiceRoll('1k10'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Pugoss',
        kepesseg: 'gyorsasag',
        tamperkor: 2,
        ke: 4,
        te: 6,
        ve: 12,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Ramiera',
        kategoria: FEGYVER_KATEGORIAK.egykezes_szuro,
        tamperkor: 1,
        ke: 8,
        te: 17,
        ve: 14,
        sebzes: parseDiceRoll('1k6+1'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Sequor',
        kepesseg: 'ugyesseg',
        tamperkor: 2,
        ke: 8,
        te: 16,
        ve: 13,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Slan csillag',
        kategoria: FEGYVER_KATEGORIAK.dobo,
        tamperkor: 3,
        ke: 10,
        te: 4,
        ve: 0,
        sebzes: parseDiceRoll('1k3'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Szigony',
        kategoria: FEGYVER_KATEGORIAK.szalfegyver,
        tamperkor: 1,
        ke: 4,
        te: 15,
        ve: 10,
        sebzes: parseDiceRoll('1k10+1'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Tahdzsi',
        kategoria: FEGYVER_KATEGORIAK.egykezes_szuro,
        tamperkor: 1,
        ke: 9,
        te: 11,
        ve: 14,
        sebzes: parseDiceRoll('1k6+1'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Tőr',
        kategoria: FEGYVER_KATEGORIAK.egykezes_szuro,
        tamperkor: 2,
        ke: 10,
        te: 8,
        ve: 2,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Tőr, dobó',
        kategoria: FEGYVER_KATEGORIAK.dobo,
        tamperkor: 2,
        ke: 10,
        te: 11,
        ve: 2,
        sebzes: parseDiceRoll('1k6'),
        sebzestipus: ['szuro']
    },
    {
        nev: 'Tőr, Slan',
        kepesseg: 'ugyesseg',
        tamperkor: 2,
        ke: 9,
        te: 14,
        ve: 6,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: ['szuro', 'vago']
    },
    {
        nev: 'Tőrkard',
        kategoria: FEGYVER_KATEGORIAK.egykezes_szuro,
        tamperkor: 2,
        ke: 9,
        te: 12,
        ve: 14,
        sebzes: parseDiceRoll('1k6+2'),
        sebzestipus: ['szuro']
    },
];

