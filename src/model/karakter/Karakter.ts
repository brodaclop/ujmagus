import { _ } from "ag-grid-community";
import { v4 } from "uuid";
import { KozelharcFegyver, KOZELHARCI_FEGYVEREK } from "../Fegyver";
import { getHarcmodor, Harcmodor, HARCMODOROK } from "../harcmodor/Harcmodor";
import { Kepesseg } from "../Kepesseg";
import { Kepzettseg, KEPZETTSEGEK, KP_SZORZOK } from "../Kepzettseg";
import { Pancel, PANCEL_FITS, PANCEL_MINOSEGEK } from "../Pancel";
import { KarakterHarcertek } from "./KarakterHarcertek";

export type Kez = 'jobb' | 'bal';
export interface KarakterKepzettseg {
    kepzettseg: Kepzettseg;
    aktKp: number;
    osszKp: number;
    fok: 0 | 1 | 2 | 3 | 4 | 5;
}

interface InventoryItemBase {
    guid: string;
}

export interface InventoryKozelharcFegyver extends InventoryItemBase {
    tipus: 'kozelharcfegyver',
    fegyver: KozelharcFegyver
}

export interface InventoryPancel extends InventoryItemBase {
    tipus: 'pancel';
    pancel: Pancel;
}

export type InventoryItem = InventoryKozelharcFegyver | InventoryPancel;

export class Karakter {

    private nev: string = '';
    readonly kepessegek: Record<Kepesseg, number> = {
        ero: 17,
        gyorsasag: 14,
        ugyesseg: 16,
        allokepesseg: 0,
        egeszseg: 0,
        intelligencia: 0,
        szepseg: 0,
        akaratero: 0,
        asztral: 0,
        erzekeles: 0
    };
    kepzettsegek: Array<KarakterKepzettseg> = [];

    inventory: Array<InventoryItem> = [{
        tipus: 'kozelharcfegyver',
        fegyver: KOZELHARCI_FEGYVEREK[0],
        guid: v4(),
    }, {
        tipus: 'kozelharcfegyver',
        fegyver: KOZELHARCI_FEGYVEREK[9],
        guid: v4(),
    }, {
        tipus: 'kozelharcfegyver',
        fegyver: KOZELHARCI_FEGYVEREK[22],
        guid: v4(),
    },
    {
        tipus: 'kozelharcfegyver',
        fegyver: KOZELHARCI_FEGYVEREK.find(f => f.pajzstype === 'nagy') as KozelharcFegyver,
        guid: v4(),
    },

    {
        tipus: 'pancel',
        guid: v4(),
        pancel: {
            nev: 'Bőrvért',
            mgt: 0,
            sfe: {
                zuzo: 2,
                vago: 1,
                szuro: 0
            },
            fit: PANCEL_FITS.atlag,
            minoseg: PANCEL_MINOSEGEK.mester
        }
    },
    {
        tipus: 'pancel',
        guid: v4(),
        pancel: {
            nev: 'Láncing',
            mgt: 3,
            sfe: {
                zuzo: 3,
                vago: 2,
                szuro: 1
            },
            fit: PANCEL_FITS.atlag,
            minoseg: PANCEL_MINOSEGEK.mester
        }
    }
    ];

    harcertekek: {
        ke: number;
        te: number;
        ve: number;
        ce: number;
        sebzes: number;
    } = {
            ke: 9,
            te: 20,
            ve: 75,
            ce: 5,
            sebzes: 0
        };

    kezek: Record<Kez, InventoryKozelharcFegyver | null> = {
        jobb: null,
        bal: null,
    };

    pancel: InventoryPancel | null = null;
    harcmodorId: string | null = null;

    megfoghatoFegyverek = (kez: 'jobb' | 'bal'): Array<InventoryKozelharcFegyver> => {
        const masikKez = kez === 'jobb' ? 'bal' : 'jobb';
        const maxKez = 2 - (this.kezek[masikKez]?.fegyver.kez ?? 0);
        return this.inventory.filter(i => i.tipus === 'kozelharcfegyver' && i.fegyver.kez <= maxKez && i.guid !== this.kezek[masikKez]?.guid) as Array<InventoryKozelharcFegyver>;
    }

    harcmodorok = (): Array<Harcmodor> => HARCMODOROK.filter(hm => hm.selectable(this));

    megfog = (kez: 'jobb' | 'bal', guid: string | null) => {
        this.kezek[kez] = this.inventory.find(i => i.guid === guid && i.tipus === 'kozelharcfegyver') as InventoryKozelharcFegyver ?? null;
        if (!this.harcmodorId || !getHarcmodor(this.harcmodorId)?.selectable(this)) {
            //reset harcmodor
            this.harcmodorId = this.harcmodorok()?.[0]?.id ?? null;
        }
    }

    mgt = (): number => {
        const vertviselet = this.kepzettseg('vertviselet');
        //TODO: pajzs mgt
        return Math.max(this.pancel?.pancel.mgt ?? 0 - (vertviselet?.fok ?? 0), 0);
    }

    mgtKepessegek = (mgt: number): Record<Kepesseg, number> => {
        const ret = { ...this.kepessegek }
        ret.ugyesseg = Math.max(ret.ugyesseg - mgt, 5);
        ret.gyorsasag = Math.max(ret.gyorsasag - mgt, 5);

        return ret;
    }

    harcertekCalculator = () => new KarakterHarcertek(this);

    felvehetoPancelok = (): Array<InventoryPancel> => this.inventory.filter(i => i.tipus === 'pancel') as Array<InventoryPancel>;

    felvesz = (guid: string) => {
        this.pancel = this.inventory.find(i => i.guid === guid && i.tipus === 'pancel') as InventoryPancel ?? null;
    }

    kepzettseg = (id: string, createIfMissing?: boolean): KarakterKepzettseg | null => {
        const ret: KarakterKepzettseg | undefined = this.kepzettsegek.find(k => k.kepzettseg.id === id);
        if (ret) {
            return ret;
        }
        const kepzettsegTemplate = KEPZETTSEGEK.find(k => k.id === id);
        if (createIfMissing && kepzettsegTemplate) {
            const uj: KarakterKepzettseg = {
                kepzettseg: kepzettsegTemplate,
                fok: 0,
                aktKp: 0,
                osszKp: 0,
            };
            this.kepzettsegek.push(uj);
            return uj;
        } else {
            return null;
        }
    }

    kpToNextFok = (id: string): number => {
        const target = this.kepzettseg(id, true);
        if (!target || target.fok === 5) {
            return 0;
        }
        const kepesseg = this.kepessegek[target.kepzettseg.kepesseg];
        return kpAdjust(target.kepzettseg.kp[target.fok], kepesseg) - target.aktKp;
    }

    addKp = (id: string, kp: number, propagateToLinked: boolean): boolean => {
        const target = this.kepzettseg(id, true);
        if (!target || target.fok === 5) {
            return false;
        }
        const kepesseg = this.kepessegek[target.kepzettseg.kepesseg];
        let maradek = kp;
        while (maradek > 0) {
            const kovFokhoz = kpAdjust(target.kepzettseg.kp[target.fok], kepesseg) - target.aktKp;
            if (maradek >= kovFokhoz) {
                target.fok++
                target.aktKp = 0;
                target.osszKp += maradek;
                maradek -= kovFokhoz;
            } else {
                target.aktKp += maradek;
                target.osszKp += maradek;
                maradek = 0;
            }
        }
        if (propagateToLinked) {
            target.kepzettseg.linked?.forEach(k => this.addKp(k.id, kp * k.strength, false));
        }

        return true;
    }

    clone = (): Karakter => {
        const ret = new Karakter();
        Object.assign(ret, _.deepCloneObject(this));
        return ret;
    }

}

const kpAdjust = (kp: number, elsodlegesKepesseg: number): number => {
    const ret = Math.round(kp * KP_SZORZOK[elsodlegesKepesseg]);
    return ret < 1 ? 1 : ret;
}