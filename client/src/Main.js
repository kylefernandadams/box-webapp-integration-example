import React, { useState } from 'react';
import { useLocation } from "react-router";
import queryString from 'query-string';

import Header from 'box-ui-elements/es/components/header/Header';
import Logo from 'box-ui-elements/es/components/logo/Logo';
import ModalDialog from 'box-ui-elements/es/components/modal/ModalDialog';

import FileInfoForm from './FileInfoForm';
import SfdcRecordInfoForm from './SfdcRecordInfoForm';

const Main = () => {
    const { search } = useLocation();
    const { fileId, userId } = queryString.parse(search);
    const [recordDetails, setRecordDetails] = useState(null);
    const receiveRecordDetails = (details) => {
        console.log('Parent - Received sfdc record details: ', details);
        setRecordDetails(details)
    };

    return (
        <div>
            <Header className="header" color="#2a61d5" fixed={true}>
                <Logo title="Box" color="white"/>
            </Header>
            <div className="dialog-row">
                <div className="dialog-column">
                    <ModalDialog title='Box File Details'>
                        <FileInfoForm fileId={fileId} userId={userId} recordDetails={recordDetails} />
                    </ModalDialog>
                </div>
                <div className="dialog-column">
                    <ModalDialog title='Salesforce Record Details'>
                        <SfdcRecordInfoForm onRecordDetailsUpdate={receiveRecordDetails}/>
                    </ModalDialog>
                </div>
            </div>
        </div>
    );
};
export default Main;
