import Tooltip from 'rc-tooltip';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Karakter, KarakterKepzettseg } from '../model/karakter/Karakter';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';

import 'rc-tooltip/assets/bootstrap_white.css';
import { KEPESSEG_LABELS } from '../model/Labels';
import { Kepesseg } from '../model/Kepesseg';

export const KarakterKepessegTable: React.FC<{ karakter: Karakter, onChange: (karakter: Karakter) => unknown }> = ({ karakter, onChange }) => {


    const rowData: Array<Record<string, unknown>> = useMemo(() => Object
        .entries(KEPESSEG_LABELS)
        .map(([key, nev]) => ({
            key,
            nev,
            value: karakter.kepessegek[key as Kepesseg]
        })), [karakter]);

    const valueRenderer = useCallback(({ key, value }: any, option: ColumnBodyOptions) => {
        return <InputNumber value={value} showButtons onChange={v => {
            karakter.kepessegek[key as Kepesseg] = v.value ?? 0;
            onChange(karakter);
        }} />
    }, [karakter, onChange]);

    return (
        <DataTable value={rowData}>
            <Column field='nev' header='Név' sortable />
            <Column header='Képesség' body={valueRenderer} sortable />
        </DataTable>
    );

}