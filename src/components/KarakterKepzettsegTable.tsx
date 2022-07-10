import Tooltip from 'rc-tooltip';
import React, { useMemo, useRef, useState } from 'react';
import { Karakter, KarakterKepzettseg } from '../model/karakter/Karakter';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnBodyOptions } from 'primereact/column';

import 'rc-tooltip/assets/bootstrap_white.css';

interface NumberWithDelta {
    current: number;
    future?: number;
}



export const KarakterKepzettsegTable: React.FC<{ karakter: Karakter, onChange: (karakter: Karakter) => unknown }> = ({ karakter, onChange }) => {


    const [delta, setDelta] = useState<Karakter>();

    const rowData: Array<Record<string, unknown>> = useMemo(() => karakter.kepzettsegek.map(({ kepzettseg: { id, tipus, nev, kepesseg, leiras, szintleiras }, fok, osszKp }) => ({
        id,
        nev,
        tipus,
        kepesseg,
        kpToNextFok: { current: karakter.kpToNextFok(id), future: delta?.kpToNextFok(id) },
        fok: { current: fok, future: delta?.kepzettseg(id)?.fok },
        osszKp: { current: osszKp, future: delta?.kepzettseg(id)?.osszKp },
        leiras,
        szintleiras
    })), [karakter, delta]);

    const nwdRenderer = (data: any, option: ColumnBodyOptions) => {
        const nwd: NumberWithDelta = data[option.column.props.field as string];
        const delta = (nwd.future ?? nwd.current) - nwd.current;
        return <>
            <span>{nwd.current}</span>
            {delta !== 0 && <span style={{ marginLeft: '0.5rem', color: delta > 0 ? 'green' : 'red' }}>{delta > 0 && '+'}{delta}</span>}
        </>;
    };

    return (
        <DataTable value={rowData}>
            <Column field='nev' header='Név' sortable />
            <Column field='kepesseg' header='Képesség' sortable />
            <Column field='tipus' header='Tipus' sortable />
            <Column field='fok' header='Fok' body={nwdRenderer} />
            <Column field='osszKp' header='Össz. KP' body={nwdRenderer} />
            <Column field='kpToNextFok' header='KP a köv. fokig' body={nwdRenderer} />
            <Column key='actions' body={({ id, leiras, szintleiras, fok }) => {
                return <>
                    <button
                        onClick={() => {
                            karakter.addKp(id, 1, true);
                            onChange(karakter);
                            setDelta(undefined);
                        }}
                        onMouseEnter={() => {
                            if (delta === undefined) {
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
                    <Tooltip trigger={['click', 'hover']} overlay={<div style={{ maxWidth: '20rem' }}>
                        <div style={{ fontWeight: 'bold' }}>{leiras}</div>
                        {szintleiras.map((l: string, i: number) =>
                            <p style={{ backgroundColor: (i <= fok.current - 1) ? 'lightgray' : 'inherit' }}>
                                <em style={{ marginRight: '1rem' }}>{i + 1}. fok:</em>
                                <span>{l}</span>
                            </p>)}
                    </div>} >
                        <button>i</button>
                    </Tooltip>
                </>
            }} />
        </DataTable>
    );

}