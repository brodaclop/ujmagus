import { FEGYVER_KATEGORIAK, KOZELHARCI_FEGYVEREK } from "./Fegyver";
import { Kepesseg } from "./Kepesseg";

export type KepzettsegTipus = 'fegyver' | 'fegyverkategoria' | 'tudomanyos' | 'harcmodor' | 'harci';

interface KepzettsegLink {
    id: string;
    strength: number;
}

export interface Kepzettseg {
    id: string;
    nev: string;
    tipus: KepzettsegTipus;
    kepesseg: Kepesseg,
    linked: Array<KepzettsegLink>;
    kp: [number, number, number, number, number],
    leiras: string,
    szintleiras: [string, string, string, string, string]
}



const generateFegyverKepzettsegek = (): Array<Kepzettseg> => KOZELHARCI_FEGYVEREK
    .filter(f => f.alapFegyver === undefined && !f.pajzstype)
    .map(f => {
        const linked: Array<KepzettsegLink> = f.kategoria ? [{ id: `fegyverkat:${f.kategoria.id}`, strength: 1 }] : [];
        return {
            id: `fegyver:${f.nev}`,
            nev: `Fegyverhasználat (${f.nev})`,
            tipus: 'fegyver',
            kepesseg: (f.kategoria?.kepesseg ?? f.kepesseg) as Kepesseg,
            linked: linked,
            kp: [1, 3, 10, 25, 40],
            leiras: 'Egy adott fegyverrel való harc. A képzetlen fegyverhasználat módosítói: KÉ: -10, TÉ: -25, VÉ: -20, CÉ: -30',
            szintleiras: [
                'KÉ: -5, TÉ: -5, VÉ: -10, CÉ: -15',
                'KÉ: 0, TÉ: 0, VÉ: 0, CÉ: 0',
                'KÉ: +2, TÉ: +5, VÉ: +5, CÉ: +5',
                'KÉ: +5, TÉ: +10, VÉ: +10, CÉ: +10',
                'KÉ: +5, TÉ: +10, VÉ: +10, CÉ: +10, túlütés határ -10'
            ]
        }
    });

const generateFegyverKategoriaKepzettsegek = (): Array<Kepzettseg> => Object.values(FEGYVER_KATEGORIAK).map(k => ({
    id: `fegyverkat:${k.id}`,
    nev: `Fegyverhasználat (${k.nev})`,
    tipus: 'fegyverkategoria',
    kepesseg: k.kepesseg,
    linked: [],
    kp: [4, 12, 40, 100, 160],
    leiras: 'Egy adott fegyverrel való harc. A képzetlen fegyverhasználat módosítói: KÉ: -10, TÉ: -25, VÉ: -20, CÉ: -30',
    szintleiras: [
        'KÉ: -5, TÉ: -5, VÉ: -10, CÉ: -15',
        'KÉ: 0, TÉ: 0, VÉ: 0, CÉ: 0',
        'KÉ: +2, TÉ: +5, VÉ: +5, CÉ: +5',
        'KÉ: +5, TÉ: +10, VÉ: +10, CÉ: +10',
        'KÉ: +5, TÉ: +10, VÉ: +10, CÉ: +10, túlütés határ -10'
    ]
}));

const TUDOMANYOS_KEPZETTSEGEK: Array<Kepzettseg> = [
    {
        id: 'sebgyogyitas',
        nev: 'Sebgyógyítás',
        tipus: 'tudomanyos',
        kepesseg: 'intelligencia',
        linked: [],
        kp: [5, 10, 15, 20, 30],
        leiras: 'A Sebgyógyítás mind a sebesülések azonnali, csatatéren való ellátását, mind a hosszabb távú ápolást magában foglalja.',
        szintleiras: ['', '', '', '', '']
    },
    {
        id: 'herbalizmus',
        nev: 'Herbalizmus',
        tipus: 'tudomanyos',
        kepesseg: 'intelligencia',
        linked: [{
            id: 'sebgyogyitas',
            strength: 1 / 2
        }, {
            id: 'meregkeveres',
            strength: 1 / 4
        }],
        kp: [2, 3, 15, 25, 40],
        leiras: 'A Herbalizmus a gyógy- vagy épp mérgező növények ismeretét, azok gyakorlati felhasználását takarja.',
        szintleiras: ['', '', '', '', '']
    },
    {
        id: 'meregkeveres',
        nev: 'Méregkeverés/Semlegesítés',
        tipus: 'tudomanyos',
        kepesseg: 'intelligencia',
        linked: [],
        kp: [5, 10, 25, 40, 60],
        leiras: 'Ez a képzettség szükséges nemcsak a mérgek előállításához, de a biztonságos kezeléséhez is. A képzetlen méregkeverőnek minden egyes alkalommal, amikor mérget használ, intelligencia-próbát kell dobnia, hogy nem éri-e baleset. A baleset lehet elpocsékolt, szennyezett méreg vagy extrém esetben akár önmaga megmérgezése is.',
        szintleiras: ['', '', '', '', '']
    },
    {
        id: 'alkimia',
        nev: 'Alkímia',
        tipus: 'tudomanyos',
        kepesseg: 'intelligencia',
        linked: [{
            id: 'meregkeveres',
            strength: 1 / 2
        }],
        kp: [5, 10, 25, 40, 60],
        leiras: '',
        szintleiras: ['', '', '', '', '']
    },
    {
        id: 'elettan',
        nev: 'Élettan',
        tipus: 'tudomanyos',
        kepesseg: 'intelligencia',
        linked: [{
            id: 'sebgyogyitas',
            strength: 1 / 2
        }],
        kp: [6, 10, 20, 35, 50],
        leiras: '',
        szintleiras: ['', '', '', '', '']
    }
];

const HARCMODOR_BASE: Pick<Kepzettseg, 'kp' | 'tipus' | 'linked'> = {
    kp: [5, 10, 20, 30, 40],
    tipus: 'harcmodor',
    linked: []
};
export const HARCMODOROK: Array<Kepzettseg> = [
    {
        ...HARCMODOR_BASE,
        nev: 'Egykezes fegyver és pajzs',
        id: 'harcmodor:pajzs',
        kepesseg: 'ugyesseg',
        leiras: `Ez a harcmodor egykezes fegyver és karra szíjazott, közepes vagy nagy pajzzsal való harchoz szükséges.
        E képzettség nélkül a pajzs leginkább csak hátrány harc közben, bár valamennyi védelmet biztosít.
        Ez a gyakorlatban annyit tesz, hogy a képzetlen karakter a pajzs VÉ-jét ugyan megkapja, de a fegyverét nem,
        továbbá a fegyverével való jártassága 2 fokkal alacsonyabbnak számít a normálnál.`,
        szintleiras: [
            `A képzettség 1. fokán már kevésbé van útban a pajzs, ezért a karakter a fegyver VÉ-jét továbbra sem kapja meg,
            viszont a fegyverével való jártassága csak 1 fokkal romlik.`,
            `A képzettség 2. fokán már a fegyver és a pajzs mozgása jól koordinált, bár a karakter továbbra is csak a pajzsot
            használja védekezésre, ezért a fegyver VÉ-je nem adódik hozzá a teljes VÉ-hez, de egyéb levonások nem sújtják.`,
            `A képzettség 3. fokán a pajzzsal való védekezés már ösztönös, így a karakter a fegyverével ugyanúgy támad és
            védekezik, mint pajzs nélkül. A karakter mind a pajzs, mind a fegyver VÉ-jét hozzáadhatja a VÉ-jéhez`,
            `A képzettség 4. fokán a pajzs már nem akadályoz a mozgásban, így MGT-je 0, és a karakter támadni is képes a
            pajzzsal, körönként egyszer.`,
            `A képzettség 5. fokán a pajzs a karakter óvó karjának kiterjesztésévé válik, így önmagán kívül még egy közelálló
            bajtársat is képes védeni vele (tehát ő is megkapja a pajzs VÉ-jét, ha mindketten ugyanazon ellenfél ellen küzdenek)`,
        ]
    },
    {
        ...HARCMODOR_BASE,
        nev: 'Egy-másfélkezes fegyver és kis pajzs/alkarvédő',
        id: 'harcmodor:kispajzs',
        kepesseg: 'gyorsasag',
        leiras: `Ez a harcmodor egy egy- vagy másfélkezes fegyvert és egy kézben fogott kicsi, kerek pajzzsal való harcot jelenti.
        Magasabb fokokon a karakter egy tőrt is foghat a pajzsos kezében, és támadhat vele. Ehhez nem kell képzettnek lenni a tőr
        használatában, hiszen teljesen más technikáról van szó. Fontos megjegyezni, hogy a tőr VÉ-je semmilyen esetben nem adódik
        hozzá a karakter VÉ-jéhez.
        E képzettség nélkül a pajzs leginkább csak hátrány harc közben, VÉ-je csak akkor számít vele a karakter VÉ-jébe, ha az adott
        körben fegyverrel nem támad, és ilyenkor is a fegyver helyett védekezik a pajzzsal.`,
        szintleiras: [
            `A képzettség 1. fokán a karakter már fegyverrel támadás közben is tud a pajzzsal védekezni, a fegyverrel viszont
            továbbra sem, így a karakter VÉ-jéhez csak a pajzs VÉ-je járul, a fegyveré nem.`,
            `A képzettség 2. fokán már mind a pajzs, mind a fegyver VÉ-je hozzáadható a karakter VÉ-jéhez`,
            `A képzettség 3. fokán a pajzs alatt/alkarvédőhöz szorított tőrrel is tud támadni a karakter, körönként egyszer`,
            `A képzettség 4. fokán a tőrrel körönként már kétszer is lehet támadni.`,
            `A képzettség 5. fokán a két kéz teljes harmóniában mozog, mind a fő fegyverrel, mind a tőrrel leadott támadásokhoz
            hozzáadható mindkét fegyver TÉ-je.`,
        ]
    },
    {
        ...HARCMODOR_BASE,
        nev: 'Kétkezes fegyver',
        id: 'harcmodor:ketkezes',
        kepesseg: 'ero',
        leiras: `A kétkezes fegyverek lassúnak és nehézkesnek tűnnek a felületes szemlélő számára, ami jórészt persze igaz is,
        ugyanakkor avatott forgatójuk jópár trükköt elsajátíthat, amelyekkel ez ellensúlyozható, sőt helyenként előnnyé
        kovácsolható. Minden fok egy újabb manőverrel gazdagítja a karakter trükktárát.`,
        szintleiras: [
            `A karakter egy ellenfelet tud távol tartani magától; amennyiben az mégis közelíteni próbál,
            egy soron kívüli támadás intézhető ellene. A manőver nem használható több ellenfél ellen, és addig nem
            ismételhető meg, amíg az ellenfél valamilyen módon ismét nem kerül távolabb.`,
            `A fegyvert rövidebbre fogva kisebb a karakter hátrányt szenved el Belharc ellen (mintha egykezes hosszú fegyver
            lenne a kezében), és szűkebb területen is tud harcolni a következő módosítókkal: KÉ: +5, TÉ: -5, VÉ: -5,
            sebzés feleződik.`,
            `A kétkezes harcmodort ezen a fokon űző karakter egy jól irányzott csapással vagy akasztással kibillentheti ellenfelét
            az egyensúlyából. Ehhez először sikeres támadó dobást kell tenni, és ha az ellenfél ezt követően elvéti
            ügyességpróbáját, földre kerül. Ugyanilyen módon az ellenfél közepes vagy nagy pajzsa is kirántható/üthető egy körre.`,
            `Mint az 1. fok, de tetszőleges számú ellenfél ellen alkalmazható, akár úgy is, ha a karaktert teljesen
            körbeveszik.`,
            `A kétkezes harcmodor magasiskolája: a karakter két, nem közvetlenül egymás mellett álló ellenfél ellen felváltva
            tud támadni, összesen duplaannyi támadást leadva, mint amennyit a fegyver sebessége engedne.`,
        ]
    },
    {
        ...HARCMODOR_BASE,
        nev: 'Shien-su',
        id: 'harcmodor:shiensu',
        kepesseg: 'akaratero',
        leiras: `A Shien-su a kardmúvészek által kidolgozott kétfegyveres technika, amely a Slan-kard és a Slan-tőr teljes
        harmóniában való mozgását szolgálja. Fontos megjegyezni, hogy Chi-harcban minden esetben az ott feltüntetett számú
        támadást lehet csak leadni a két fegyverrel összesen, nem jár több támadás, akármennyire is képzett e 
        harcmodorban a kardművész.`,
        szintleiras: [
            `A karakter levonások nélkül forgathatja egyszerre a kardot és a tőrt, de támadni csak a karddal tud, a tőr mindig
            a kardművész karddal ellentétes oldala fele mozog, így semlegesítve bármilyen túlerőből adódó levonást.`,
            `A kardművész ezen a fokon már védekezni is tud a tőrrel, a tőr VÉ-jét hozzáadhatja a teljes VÉ-jéhez.`,
            `A kardművész ezen a fokon már támadni is tud a Slan tőrrel, körönként kétszer.`,
            `A tőr és a kard teljes harmóniában mozog, mindkét fegyver TÉ-je és VÉ-je hozzáadódik minden támadáshoz.`,
            `A kardművész immár a fegyverhasználat fokából adódó bónuszokat is hozzáadhatja a másik fegyveréhez.`,
        ]
    }
];

export const HARCI_KEPZETTSEGEK: Array<Kepzettseg> = [
    {
        id: 'vertviselet',
        nev: 'Vértviselet',
        tipus: 'harci',
        kepesseg: 'allokepesseg',
        linked: [],
        kp: [3, 10, 20, 40, 50],
        leiras: 'Páncélt hatékonyan viselni csak gyakorlással lehet. Minden egyes fok 1-gyel cs0kkenti a páncél MGT-jét',
        szintleiras: ['', '', '', '', '']
    },
]

export const KEPZETTSEGEK: Array<Kepzettseg> = [
    ...generateFegyverKategoriaKepzettsegek(),
    ...generateFegyverKepzettsegek(),
    ...TUDOMANYOS_KEPZETTSEGEK,
    ...HARCMODOROK
];


export const getKepzettseg = (id: string): Kepzettseg | undefined => KEPZETTSEGEK.find(k => k.id === id);
export const KP_SZORZOK: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.2, 1.1, 1, 1, 0.9, 0.9, 0.8, 0.8, 0.7, 0.6, 0.5, 0.4, 0.4, 0.4, 0.4];
