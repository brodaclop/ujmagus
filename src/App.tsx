import React, { useState } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-balham.css'; // Optional theme CSS
import { KozelharcFegyverTable } from './components/FegyverTable';
import { KOZELHARCI_FEGYVEREK } from './model/Fegyver';
import { Karakter } from './model/Karakter';
import { KEPZETTSEGEK } from './model/Kepzettseg';
import { KarakterKepzettsegTable } from './components/KarakterKepzettsegTable';


//TODO: how to handle fraction KPs?
//TODO: calculate fok on the fly?

function App() {

  const INIT_KARAKTER = new Karakter();
  INIT_KARAKTER.addKp('fegyver:Tőr', 0, true);
  INIT_KARAKTER.addKp('herbalizmus', 0, true);
  INIT_KARAKTER.addKp('elettan', 0, true);
  INIT_KARAKTER.addKp('alkimia', 0, true);
  INIT_KARAKTER.addKp('harcmodor:pajzs', 0, true);
  INIT_KARAKTER.addKp('harcmodor:kispajzs', 0, true);

  const [karakter, setKarakter] = useState<Karakter>(INIT_KARAKTER);

  return (
    <div className="App">
      <KozelharcFegyverTable fegyverek={KOZELHARCI_FEGYVEREK} />
      <KarakterKepzettsegTable karakter={karakter} onChange={k => setKarakter(k.clone())} />
    </div>
  );
}

export default App;
