import React, { useState } from 'react';
import Form from 'box-ui-elements/es/components/form-elements/form/Form'
import PrimaryButton from 'box-ui-elements/es/components/primary-button/PrimaryButton';
import TextInput from 'box-ui-elements/es/components/text-input/TextInput';
import axios from 'axios';

const SfdcRecordInfoForm = (recordProps) => {
    let baseServerEndpoint;
    if(process.env.NODE_ENV === 'production') {
        baseServerEndpoint = 'https://server-example-dot-my-project-id.appspot.com';
    } else {
        baseServerEndpoint = 'http://localhost:8080';
    }

    const [recordInfo, setRecordInfo] = useState({
        recordId: '',
        sobject: '',
        recordName: '',
        owner: '',
        closeDate: '',
        amount: '',
        receivedFileInfo: false
    });

    const handleSubmit = () => {
        const sfdcRecordInfoEndpoint = baseServerEndpoint + '/sfdc/record-info';
        axios.get(sfdcRecordInfoEndpoint, {
            params: {
                recordId: recordInfo.recordId,
                sobject: recordInfo.sobject
            }
        })
        .then(recordInfoRes => {
            const recordData = recordInfoRes.data;
            console.log('Found record info: ', recordData);
            setRecordInfo({
                recordId: recordData.Id,
                sobject: recordData.attributes.type,
                recordName: recordData.Name,
                owner: recordData.OwnerId,
                closeDate: recordData.CloseDate,
                amount: recordData.Amount,
                receivedFileInfo: true
            });
            recordProps.onRecordDetailsUpdate(recordInfo);
        })
        .catch(err => {
            console.log('Failed to get file info: ', err);
        });
    }

    const handleChange = (formData) => {
        console.log('Sfdc Form - Handling change with form data: ', JSON.stringify(formData, null, 2));
        setRecordInfo(formData);
    }

    return (
        <div className="salesforce-record-form">
            <Form
                onValidSubmit={handleSubmit}
                onChange={handleChange}>
                <TextInput
                    name="recordId"
                    isRequired={true}
                    label="Record Id"
                    type="text"
                    isRequired
                />
                <TextInput
                    name="sobject"
                    isRequired={true}
                    label="SObject Type"
                    type="text"
                    isRequired
                />
                <TextInput
                    name="recordName"
                    label="Name"
                    type="text"
                    onChange={handleChange}
                    value={recordInfo.recordName}
                />
                <TextInput
                    name="closeDate"
                    label="Close Date"
                    type="text"
                    onChange={handleChange}
                    value={recordInfo.closeDate}
                />
                <TextInput
                    name="amount"
                    label="Amount"
                    type="text"
                    onChange={handleChange}
                    value={recordInfo.amount}
                />
                <PrimaryButton type="submit" className="get-record-info">Get Salesforce Record</PrimaryButton>
            </Form>
        </div>
    );
};
export default SfdcRecordInfoForm;
