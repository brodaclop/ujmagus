import { SebzesTipus } from "./Fegyver";
import { Kepesseg } from "./Kepesseg";

export const KEPESSEG_LABELS: Record<Kepesseg | 'null', string> = {
    ero: 'Erő',
    gyorsasag: 'Gyorsaság',
    ugyesseg: 'Ügyesség',
    allokepesseg: 'Állóképesség',
    egeszseg: 'Egészség',
    szepseg: 'Szépség',
    intelligencia: 'Intelligencia',
    akaratero: 'Akaraterő',
    asztral: 'Asztrál',
    erzekeles: 'Érzékelés',
    null: '-'
}

export const SEBZESTIPUS_LABELS: Record<SebzesTipus | 'null', string> = {
    null: '-',
    szuro: 'Szúró',
    vago: 'Vágó',
    zuzo: 'Zúzó'
}

export const formatFraction = (num: number): string => {
    if (num >= 1) {
        return String(num);
    } else {
        return `1/${Math.floor(1 / num)}`;
    }
}

