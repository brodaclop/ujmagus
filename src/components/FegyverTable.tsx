import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React from 'react';
import { KozelharcFegyver, SebzesTipus } from '../model/Fegyver';
import { Kepesseg } from '../model/Kepesseg';
import { formatFraction, KEPESSEG_LABELS, SEBZESTIPUS_LABELS } from '../model/Labels';
import { formatDiceRoll } from '../model/roll';

export const formatSebzesTipus = (t: SebzesTipus | Array<SebzesTipus>): string =>
    (typeof t === 'string' ? [t] : t).sort().map(o => SEBZESTIPUS_LABELS[o ?? 'null']).join('/');

const COLUMNS: Array<ColDef> = [
    {
        headerName: 'Név',
        field: 'nev',
    },
    {
        headerName: 'Kategória',
        field: 'kategoria.nev',
        valueFormatter: cell => cell.value ?? '-'
    },
    {
        headerName: 'Képesség',
        valueGetter: row => row.data.kategoria?.kepesseg ?? row.data.kepesseg ?? 'null',
        valueFormatter: cell => KEPESSEG_LABELS[cell.value as Kepesseg]
    },
    {
        headerName: 'Képzettség',
        valueGetter: row => row.data.alapFegyver ?? row.data.nev,
    },
    {
        headerName: 'KÉ',
        field: 'ke',
        filter: 'number',
    },
    {
        headerName: 'TÉ',
        field: 'te',
        filter: 'number',
    },
    {
        headerName: 'VÉ',
        field: 've',
        filter: 'number',
    },
    {
        headerName: 'Sebzés',
        field: 'sebzes',
        valueFormatter: cell => formatDiceRoll(cell.value)
    },
    {
        headerName: 'Sebzéstípus',
        field: 'sebzestipus',
        valueFormatter: cell => formatSebzesTipus(cell.value)
    },
    {
        headerName: 'Tám/kör',
        field: 'tamperkor',
        valueFormatter: cell => formatFraction(cell.value)
    },
];

export const KozelharcFegyverTable: React.FC<{ fegyverek: Array<KozelharcFegyver> }> = ({ fegyverek }) => {

    return <div className="ag-theme-alpine" style={{ width: '100%', height: 500 }}>
        <AgGridReact
            columnDefs={COLUMNS}
            rowData={fegyverek}
            defaultColDef={{
                sortable: true,
                filter: true,
            }}
        />
    </div>


    // return <table>
    //     <thead>
    //         <tr>
    //             <th>Név</th>
    //             <th>Kategória</th>
    //             <th>Képesség</th>
    //             <th>Képzettség</th>
    //             <th>KÉ</th>
    //             <th>TÉ</th>
    //             <th>VÉ</th>
    //             <th>Sebzés</th>
    //             <th>Sebzéstípus</th>
    //             <th>Tám/kör</th>
    //         </tr>
    //     </thead>
    //     <tbody>
    //         {fegyverek.map(fegyver => <tr>
    //             <td>{fegyver.nev}</td>
    //             <td>{fegyver.kategoria?.nev ?? '-'}</td>
    //             <td>{KEPESSEG_LABELS[fegyver.kategoria?.kepesseg ?? fegyver.kepesseg ?? 'null']}</td>
    //             <td>{fegyver.alapFegyver ?? fegyver.nev}</td>
    //             <td>{fegyver.ke}</td>
    //             <td>{fegyver.te}</td>
    //             <td>{fegyver.ve}</td>
    //             <td>{formatDiceRoll(fegyver.sebzes)}</td>
    //             <td>{formatSebzesTipus(fegyver.sebzestipus)}</td>
    //             <td>{formatFraction(fegyver.tamperkor)}</td>
    //         </tr>)}
    //     </tbody>
    // </table>
}