import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import Tooltip from 'rc-tooltip';
import React, { useMemo, useRef, useState } from 'react';
import { Karakter, KarakterKepzettseg } from '../model/Karakter';

import 'rc-tooltip/assets/bootstrap_white.css';

interface NumberWithDelta {
    current: number;
    future?: number;
}

const NUMBER_WITH_DELTA_COLUMN: ColDef = {
    cellRenderer: (params: ICellRendererParams) => {
        const nwd: NumberWithDelta = params.value;
        const delta = (nwd.future ?? nwd.current) - nwd.current;
        return <>
            <span>{nwd.current}</span>
            {delta !== 0 && <span style={{ marginLeft: '0.5rem', color: delta > 0 ? 'green' : 'red' }}>{delta > 0 && '+'}{delta}</span>}
        </>;
    }
}

let rendercount = 0;

export const KarakterKepzettsegTable: React.FC<{ karakter: Karakter, onChange: (karakter: Karakter) => unknown }> = ({ karakter, onChange }) => {

    console.log('render', ++rendercount);

    const grid = useRef<AgGridReact | null>(null);

    const [delta, setDelta] = useState<Karakter>();

    const COLUMNS: Array<ColDef> = useMemo(() => [
        {
            headerName: 'Név',
            field: 'nev',
        },
        {
            headerName: 'Képesség',
            field: 'kepesseg',
        },
        {
            headerName: 'Fok',
            field: 'fok',
            type: 'nwd'
        },
        {
            headerName: 'Össz KP',
            field: 'osszKp',
            type: 'nwd'
        },
        {
            headerName: 'KP a köv fokig',
            field: 'kpToNextFok',
            type: 'nwd'
        },
        {
            headerName: '',
            cellRenderer: (params: ICellRendererParams) => <>
                <button
                    onClick={() => {
                        const id = params.data.id;
                        karakter.addKp(id, 1, true);
                        onChange(karakter);
                        setDelta(undefined);
                    }}
                    onMouseEnter={() => {
                        if (delta === undefined) {
                            const id = params.data.id;
                            const future = karakter.clone();
                            future.addKp(id, 1, true);
                            setDelta(future);
                        }
                    }}
                    onMouseLeave={() => {
                        if (delta !== undefined) {
                            setDelta(undefined);
                        }
                    }}
                >+</button>
                <Tooltip trigger={['click']} overlay={<div style={{ maxWidth: '20rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{params.data.leiras}</div>
                    {params.data.szintleiras.map((l: string, i: number) =>
                        <p style={{ backgroundColor: (i === params.data.fok.current - 1) ? 'lightgray' : 'inherit' }}>
                            <em style={{ marginRight: '1rem' }}>{i + 1}. fok:</em>
                            <span>{l}</span>
                        </p>)}
                </div>} >
                    <button>i</button>
                </Tooltip>
            </>
        }
    ], [karakter, onChange, delta]);

    const rowData: Array<Record<string, unknown>> = useMemo(() => karakter.kepzettsegek.map(({ kepzettseg: { id, nev, kepesseg, leiras, szintleiras }, fok, osszKp }) => ({
        id,
        nev,
        kepesseg,
        kpToNextFok: { current: karakter.kpToNextFok(id), future: delta?.kpToNextFok(id) },
        fok: { current: fok, future: delta?.kepzettseg(id).fok },
        osszKp: { current: osszKp, future: delta?.kepzettseg(id).osszKp },
        leiras,
        szintleiras
    })), [karakter, delta]);

    return <div className="ag-theme-balham" style={{ width: '100%', height: 500 }}>
        <AgGridReact
            ref={grid}
            columnDefs={COLUMNS}
            rowData={rowData}
            columnTypes={{
                nwd: NUMBER_WITH_DELTA_COLUMN
            }}
            defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
            }}
        />
    </div>;
}