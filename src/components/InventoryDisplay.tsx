import React, { useState } from 'react';

import { DataView, DataViewLayoutOptions, DataViewLayoutType } from 'primereact/dataview';
import { InventoryItem, Karakter } from '../model/karakter/Karakter';
import { Card } from 'primereact/card';
import { ModalDialog } from './ModalDialog';
import { InventoryAddForm } from './InventoryAddForm';
import { Button } from 'primereact/button';

export const InventoryDisplay: React.FC<{ karakter: Karakter, onChange: (karakter: Karakter) => unknown }> = ({ karakter, onChange }) => {

    const itemRenderer: (item: InventoryItem, layout: DataViewLayoutType) => React.ReactNode = (item, layout) => {
        const title = item.tipus === 'kozelharcfegyver' ? item.fegyver.nev : item.pancel.nev;
        const tipus = item.tipus;
        console.log('rendering', title, tipus);
        return <Card title={title}>
            {tipus}
        </Card>
    };

    console.log('inventory', karakter.inventory);
    return <>
        <InventoryAddForm onAdd={item => {
            karakter.inventory.push(item);
            onChange(karakter);
        }} />
        <DataView paginator rows={10} value={karakter.inventory} layout='list' itemTemplate={itemRenderer}></DataView>;
    </>
}