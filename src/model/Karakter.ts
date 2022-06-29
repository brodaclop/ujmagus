import { _ } from "ag-grid-community";
import { Kepesseg } from "./Kepesseg";
import { Kepzettseg, KEPZETTSEGEK, KP_SZORZOK } from "./Kepzettseg";

export interface KarakterKepzettseg {
    kepzettseg: Kepzettseg;
    aktKp: number;
    osszKp: number;
    fok: 0 | 1 | 2 | 3 | 4 | 5;
}

export class Karakter {
    private nev: string = '';
    private kepessegek: Record<Kepesseg, number> = {
        ero: 14,
        gyorsasag: 18,
        ugyesseg: 16,
        allokepesseg: 17,
        egeszseg: 18,
        intelligencia: 19,
        szepseg: 10,
        akaratero: 11,
        asztral: 12,
        erzekeles: 13
    } as Record<Kepesseg, number>;
    kepzettsegek: Array<KarakterKepzettseg> = [];



    kepzettseg = (id: string, createIfMissing?: boolean): KarakterKepzettseg => {
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
            throw new Error(`kepzettseg not found: ${id}`);
        }
    }

    kpToNextFok = (id: string): number => {
        const target = this.kepzettseg(id, true);
        if (target.fok === 5) {
            return 0;
        }
        const kepesseg = this.kepessegek[target.kepzettseg.kepesseg];
        return kpAdjust(target.kepzettseg.kp[target.fok], kepesseg) - target.aktKp;
    }

    addKp = (id: string, kp: number, propagateToLinked: boolean): boolean => {
        const target = this.kepzettseg(id, true);
        if (target.fok === 5) {
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