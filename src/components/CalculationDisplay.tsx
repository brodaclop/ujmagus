import React from 'react';
import { aggregateCalculation, CalculationStep } from '../model/Calculation';
import { formatDiceRoll } from '../model/roll';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Tooltip from 'rc-tooltip';

export const CalculationDisplay: React.FC<{ calculation: Array<CalculationStep> }> = ({ calculation }) => {
    const sum = aggregateCalculation(calculation);
    const rowData: Array<Record<'nev' | 'value', unknown>> = [...calculation.map(step => ({ nev: step.nev, value: formatDiceRoll(step.value) })), { nev: 'Összeg', value: formatDiceRoll(sum) }]
    return <Tooltip overlay={<DataTable tableClassName='no-header' value={rowData}>
        <Column field='nev' />
        <Column field='value' />
    </DataTable>
    }>
        <span>{formatDiceRoll(sum)}</span>
    </Tooltip>

};