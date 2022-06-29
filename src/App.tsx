import React, { useState } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-balham.css'; // Optional theme CSS
import { KozelharcFegyverTable } from './components/FegyverTable';
import { KOZELHARCI_FEGYVEREK } from './model/Fegyver';
import { Karakter } from './model/Karakter';
import { KEPZETTSEGEK } from './model/Kepzettseg';
import { KarakterKepzettsegTable } from './components/KarakterKepzettsegTable';
import { TabView, TabPanel } from 'primereact/tabview';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

function App() {

  const INIT_KARAKTER = new Karakter();
  KEPZETTSEGEK.forEach(k => INIT_KARAKTER.addKp(k.id, 0, true))

  const [karakter, setKarakter] = useState<Karakter>(INIT_KARAKTER);

  return (<TabView>
    <TabPanel header="Fegyverek">
      <KozelharcFegyverTable fegyverek={KOZELHARCI_FEGYVEREK} />
    </TabPanel>
    <TabPanel header="Képzettségek">
      <KarakterKepzettsegTable karakter={karakter} onChange={k => setKarakter(k.clone())} />
    </TabPanel>

  </TabView>
  );
}

export default App;
