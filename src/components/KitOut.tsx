import React from 'react';

import { ReactComponent as Csavo } from './csavo.svg';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Karakter } from '../model/karakter/Karakter';
import { formatSebzesTipus } from './FegyverTable';
import { SEBZESTIPUS_LABELS } from '../model/Labels';
import { CalculationDisplay } from './CalculationDisplay';
import { CalculatedHarcertek, KezHarcertek, KozosHarcertek } from '../model/karakter/KarakterHarcertek';
import { getHarcmodor } from '../model/harcmodor/Harcmodor';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const KezTable: React.FC<{ harcertek: KezHarcertek | null, kez: 'jobb' | 'bal' }> = ({ harcertek, kez }) => {
    return <table style={{ fontSize: 'large', fontWeight: 'bold' }}>
        <tbody>
            <tr>
                <td>KÉ:</td>
                <td>{harcertek && <CalculationDisplay calculation={harcertek.ke} />}</td>
            </tr>
            <tr>
                <td>TÉ:</td>
                <td>{harcertek && <CalculationDisplay calculation={harcertek.te} />}</td>
            </tr>
            <tr>
                <td>Sebzés</td>
                <td>{harcertek && <CalculationDisplay calculation={harcertek.sebzes} />}
                    {harcertek?.sebzestipus && formatSebzesTipus(harcertek.sebzestipus)}</td>
            </tr>
            <tr>
                <td>Tám/kör</td>
                <td>{harcertek && <CalculationDisplay calculation={harcertek.tamPerKor} />}</td>
            </tr>
            <tr>
                <td>Túlütés</td>
                <td>{harcertek && <CalculationDisplay calculation={harcertek.tulutesHatar} />}</td>
            </tr>
        </tbody>
    </table>
};

const PancelTable: React.FC<{ harcertek: KozosHarcertek }> = ({ harcertek }) => <table style={{ fontSize: 'large', fontWeight: 'bold' }}>
    <tbody>
        <tr>
            <td>VÉ:</td>
            <td />
            <td colSpan={2}><CalculationDisplay calculation={harcertek.ve} /></td>
        </tr>
        <tr>
            <td>SFÉ</td>
            <td>{SEBZESTIPUS_LABELS.szuro}</td>
            <td>{SEBZESTIPUS_LABELS.vago}</td>
            <td>{SEBZESTIPUS_LABELS.zuzo}</td>
        </tr>
        <tr>
            <td />
            <td><CalculationDisplay calculation={harcertek.sfe.szuro} /></td>
            <td><CalculationDisplay calculation={harcertek.sfe.vago} /></td>
            <td><CalculationDisplay calculation={harcertek.sfe.zuzo} /></td>
        </tr>
        <tr>
            <td>MGT:</td>
            <td />
            <td colSpan={2}><CalculationDisplay calculation={harcertek.mgt} /></td>
        </tr>
    </tbody>
</table>

const PancelCard: React.FC<{ harcertek: CalculatedHarcertek, karakter: Karakter, onChange: (karakter: Karakter) => unknown, style: object }> = ({ harcertek, karakter, onChange, style }) => {
    const ures: ItemOption = { nev: 'Nincs', guid: null }
    const felveheto = karakter.felvehetoPancelok().map(i => ({ nev: i.pancel.nev, guid: i.guid }));
    const viselt = felveheto.find(mf => mf.guid === karakter.pancel?.guid) ?? ures;
    return <Card style={style} title='Páncél'>
        <Dropdown optionLabel='nev' options={[ures, ...felveheto]} disabled={felveheto.length === 0} value={viselt} onChange={params => {
            karakter.felvesz(params.value?.guid ?? null);
            onChange(karakter);
        }} />
        <PancelTable harcertek={harcertek.kozos} />
    </Card>
}


const KezCard: React.FC<{ karakter: Karakter, onChange: (karakter: Karakter) => unknown, harcertek: CalculatedHarcertek, style: object, kez: 'jobb' | 'bal' }> = ({ karakter, onChange, harcertek, kez, style }) => {
    const ures: ItemOption = { nev: 'Üres', guid: null }
    const megFoghato = karakter.megfoghatoFegyverek(kez).map(i => ({ nev: i.fegyver.nev, guid: i.guid }));
    const fogott = megFoghato.find(mf => mf.guid === karakter.kezek[kez]?.guid) ?? ures;
    return <Card style={style} title={`${kez[0].toUpperCase()}${kez.substring(1)} kéz`}>
        <Dropdown optionLabel='nev' options={[ures, ...megFoghato]} disabled={megFoghato.length === 0} value={fogott} onChange={params => {
            karakter.megfog(kez, params.value?.guid ?? null);
            onChange(karakter);
        }} />
        <KezTable harcertek={harcertek[kez]} kez={kez} />
    </Card>
}

const ExtraCard: React.FC<{ harcertek: CalculatedHarcertek, karakter: Karakter, onChange: (karakter: Karakter) => unknown; style: object }> = ({ harcertek, karakter, onChange, style }) => {
    const harcmodorok = karakter.harcmodorok();
    return <Card title='Harcmodor' style={style}>
        <Dropdown optionLabel='nev' options={harcmodorok} disabled={harcmodorok.length === 0} value={getHarcmodor(karakter.harcmodorId)} onChange={params => {
            karakter.harcmodorId = params.value?.id ?? null;
            onChange(karakter);
        }} />

        {harcertek.extra.length > 0 && <DataTable tableClassName='no-header' value={harcertek.extra}>
            <Column field='nev' />
            <Column field='description' />
        </DataTable>}
    </Card >
}

const FejCard: React.FC<{ karakter: Karakter, onChange: (karakter: Karakter) => unknown; style: object }> = ({ karakter, onChange, style }) => {
    return <Card style={style}>
        <table style={{ fontSize: 'large', fontWeight: 'bold' }}>
            <thead>
                <tr>
                    <td />
                    <td>Akt</td>
                    <td>Max</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Pszi</td>
                    <td>12</td>
                    <td>18</td>
                </tr>
                <tr>
                    <td>Mana</td>
                    <td>21</td>
                    <td>24</td>
                </tr>
            </tbody>
        </table>
    </Card>
}

const EletCard: React.FC<{ karakter: Karakter, onChange: (karakter: Karakter) => unknown; style: object }> = ({ karakter, onChange, style }) => {
    return <Card style={style}>
        <table style={{ fontSize: 'large', fontWeight: 'bold' }}>
            <thead>
                <tr>
                    <td />
                    <td>Akt</td>
                    <td>Max</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ÉP</td>
                    <td>12</td>
                    <td>18</td>
                </tr>
                <tr>
                    <td>FP</td>
                    <td>21</td>
                    <td>24</td>
                </tr>
            </tbody>
        </table>
    </Card>
}


interface ItemOption {
    nev: string,
    guid: string | null,
}

const position = (top: number, left: number): object => ({ position: 'absolute', top: `${top}%`, left: `${left}%`, transform: 'translate(-50%, -50%)' })
export const KitOut: React.FC<{ karakter: Karakter, onChange: (karakter: Karakter) => unknown }> = ({ karakter, onChange }) => {

    const harcertek = karakter.harcertekCalculator().harcertek();

    return <div style={{ position: 'relative', justifyContent: 'center', display: 'flex' }}>
        <Csavo style={{ height: '80vh' }} />
        <FejCard karakter={karakter} style={position(10, 50)} onChange={onChange} />
        <EletCard karakter={karakter} style={position(70, 50)} onChange={onChange} />
        <KezCard harcertek={harcertek} style={position(50, 35)} karakter={karakter} onChange={onChange} kez='jobb' />
        <KezCard harcertek={harcertek} style={position(50, 65)} karakter={karakter} onChange={onChange} kez='bal' />
        <PancelCard harcertek={harcertek} style={position(35, 50)} karakter={karakter} onChange={onChange} />
        <ExtraCard karakter={karakter} style={position(100, 50)} onChange={onChange} harcertek={harcertek} />
    </div>;
}