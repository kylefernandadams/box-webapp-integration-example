/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';

import Form from 'box-ui-elements/es/components/form-elements/form/Form'
import TextInput from 'box-ui-elements/es/components/text-input/TextInput';
import DatePicker from 'box-ui-elements/es/components/date-picker/DatePicker';
import { Notification, NotificationsWrapper } from 'box-ui-elements/es/components/notification';
import PrimaryButton from 'box-ui-elements/es/components/primary-button/PrimaryButton';
import Button from 'box-ui-elements/es/components/button/Button';
import axios from 'axios';

const FileInfoForm = (fileProps) => {
    let baseServerEndpoint;
    if(process.env.NODE_ENV === 'production') {
        baseServerEndpoint = 'https://server-example-dot-my-project-id.appspot.com';
    } else {
        baseServerEndpoint = 'http://localhost:8080';
    }

    const [fileInfo, setFileInfo] = useState({
        fileId: fileProps.fileId,
        fileName: '',
        ownedBy: '',
        createdAt: '',
        sharedLink: ''
    });
    const [notification, setNotification] = useState({
        id: 0,
        instances: new Map()
    });

    const handleChange = () => {
        console.log('Stub for handling changes...');
    }

    const handleSubmit = () => {
        const postFeedItemEndpoint = baseServerEndpoint + '/sfdc/feed-item';
        const recordInfo = fileProps.recordDetails;
        const body = {
            recordId: recordInfo.recordId,
            text: `File Id: ${fileInfo.fileId}\n
                File Name: ${fileInfo.fileName}\n
                Owned By: ${fileInfo.ownedBy}\n
                Created At: ${fileInfo.createdAt}\n
                Shared Link: ${fileInfo.sharedLink}`
        }
        axios.post(postFeedItemEndpoint, body)
        .then(feedItem => {
            console.log('Created feed item: ', JSON.stringify(feedItem, null, 2));
            addNotification();
        })
        .catch(err => {
            console.log('Failed to get file info: ', err);
        });
    }

    const addNotification = () => {
        console.log('Handling notifications...');
        const recordInfo = fileProps.recordDetails;
        const instance = (
            <Notification key={0} type="info" duration={'short'} onClose={() => {
                closeNotification(notification.id)
            }} className="notification">
                <span>Successfully posted File to Salesforce</span>
                <Button onClick={() => {
                    console.log('Click click click....');
                    window.location = `https://dev1-massnerder-dev-ed.lightning.force.com/lightning/r/${recordInfo.object}/${recordInfo.recordId}/view`;
                }} >View Salesforce Record</Button>
            </Notification>
        );
        setNotification({
            instances: notification.instances.set(0, instance),
            id: notification.id
        });
    }

    const closeNotification = id => {
        const { instances } = notification;

        instances.delete(id);
        setNotification({instances});
    }

    useEffect(() => {
        if(!fileInfo.sharedLink && (fileProps.fileId && fileProps.userId)) {
            const body = {
                fileId: fileProps.fileId,
                userId: fileProps.userId,
                authCode: fileProps.authCode
            };
            const fileInfoEndpoint = baseServerEndpoint + '/box/file-info'
            console.log(`Sending POST request to endpoint: ${fileInfoEndpoint} and with body: ${body}`);

            axios.post(fileInfoEndpoint, body)
            .then(fileInfo => {
                const createdAtDate = new Date(fileInfo.data.created_at);

                setFileInfo({
                    fileId: fileInfo.data.id,
                    fileName: fileInfo.data.name,
                    ownedBy: fileInfo.data.owned_by.login,
                    createdAt: createdAtDate,
                    sharedLink: fileInfo.data.shared_link.url
                });
            })
            .catch(err => {
                console.log('Failed to get file info: ', err);
            });
        }
    });

    return (
        <div className="file-info-form">
            <Form
            onValidSubmit={handleSubmit}
            >
                <TextInput
                    name="fileId"
                    label="File Id"
                    type="text"
                    isRequired
                    onChange={handleChange}
                    value={fileInfo.fileId}
                />
                <TextInput
                    name="fileName"
                    label="File Name"
                    type="text"
                    isRequired
                    onChange={handleChange}
                    value={fileInfo.fileName}
                />
                <TextInput
                    name="ownedBy"
                    label="Owned By"
                    type="text"
                    isRequired
                    onChange={handleChange}
                    value={fileInfo.ownedBy}
                />
                <DatePicker
                    name="createdAt"
                    label="Created At"
                    isRequired
                    onChange={handleChange}
                    value={fileInfo.createdAt}
                />
                <TextInput
                    name="sharedLink"
                    label="Shared Link"
                    type="url"
                    isRequired
                    onChange={handleChange}
                    value={fileInfo.sharedLink}
                />
                <NotificationsWrapper className="notifications">{[...notification.instances.values()]}</NotificationsWrapper>
                <PrimaryButton type="submit" className="file-link-submit">Share File to Salesforce</PrimaryButton>
            </Form>
        </div>
    );
};

export default FileInfoForm;
