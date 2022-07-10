import React, { ReactNode, useState } from 'react';

import { Dialog, DialogTemplateType } from 'primereact/dialog';
import { Button } from 'primereact/button';

export const ModalDialog: React.FC<{ buttonLabel: string, children?: React.ReactNode; footer?: DialogTemplateType }> = ({ buttonLabel, footer, children }) => {

    const [show, setShow] = useState<boolean>(false);

    return <>
        <Button label={buttonLabel} onClick={() => setShow(true)} />

        <Dialog header="Header" visible={show} style={{ width: '50vw' }} onHide={() => setShow(false)} footer={footer}>
            {children}
        </Dialog>
    </>;
}