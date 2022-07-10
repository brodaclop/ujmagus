import React, { useState } from 'react';
import { InventoryItem } from '../model/karakter/Karakter';


import { SelectButton } from 'primereact/selectbutton';
import { KozelharcFegyver, KOZELHARCI_FEGYVEREK } from '../model/Fegyver';
import { Dropdown } from 'primereact/dropdown';
import { v4 } from 'uuid';
import { Button } from 'primereact/button';
import { ModalDialog } from './ModalDialog';

const TIPUSOK: Record<InventoryItem['tipus'], string> = {
    'kozelharcfegyver': 'Közelharci fegyver',
    'pancel': 'Páncél',
};

const FegyverForm: React.FC<{ fegyver?: KozelharcFegyver, onSelect: (fegyver: KozelharcFegyver) => unknown }> = ({ fegyver, onSelect }) => {
    return <div>
        <Dropdown value={fegyver} options={KOZELHARCI_FEGYVEREK} optionLabel='nev' onChange={({ value }) => onSelect(value)} />;
    </div>
}

export const InventoryAddForm: React.FC<{ onAdd: (item: InventoryItem) => unknown }> = ({ onAdd }) => {
    const [tipus, setTipus] = useState<InventoryItem['tipus']>();
    const [fegyver, setFegyver] = useState<KozelharcFegyver>();
    return <>
        <ModalDialog buttonLabel='Új tárgy' footer={() => <Button label='OK' disabled={!tipus || !fegyver} onClick={() => {
            if (tipus && fegyver) {
                onAdd({
                    tipus: 'kozelharcfegyver',
                    fegyver: fegyver,
                    guid: v4()
                });
            }
        }} />}>
            <SelectButton value={tipus} options={Object.entries(TIPUSOK).map(([value, label]) => ({ value, label }))} onChange={({ value }) => setTipus(value)} />
            {tipus === 'kozelharcfegyver' && <FegyverForm fegyver={fegyver} onSelect={setFegyver} />}

        </ModalDialog>
    </>
};