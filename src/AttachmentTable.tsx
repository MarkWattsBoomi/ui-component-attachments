import * as React from 'react';
import './css/attachments.css';
import { FlowComponent } from './models/FlowComponent';
import { FlowField } from './models/FlowField';
import { FlowObjectData } from './models/FlowObjectData';
import { FlowObjectDataArray } from './models/FlowObjectDataArray';
import { FlowObjectDataProperty } from './models/FlowObjectDataProperty';
import { FlowPage } from './models/FlowPage';
import { IManywho } from './models/interfaces';
import ModalDialog from './models/ModalDialog';

declare const manywho: IManywho;

class AttachmentTable extends FlowPage {

    modalShown: boolean = false;

    newTitle: any;
    newFile: any;

    newName: string;
    newMime: string;
    newDate: Date;
    newData: string;

    constructor(props: any) {
        super(props);

        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addAttachment = this.addAttachment.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
    }

    addAttachment() {
        this.showModal();
    }

    // this copies the file data as base64 dara-uri into this.newData
    fileSelected(e: any) {
        let file: any;

        if (this.newFile.files && this.newFile.files.length > 0) {
            this.newName = this.newFile.files[0].name;
            this.newMime = this.newFile.files[0].type;
            this.newDate = this.newFile.files[0].lastModifiedDate;
            const aa = this;
            const reader = new FileReader();
            reader.onload = function(e: any) {
                aa.newData = e.target.result;
            };
            reader.readAsDataURL(this.newFile.files[0]);
        }
    }

    showModal() {
        this.modalShown = true;
        this.forceUpdate();
    }

    async closeModal(save: boolean) {
        if (save === true) {
            const attachment = new FlowObjectData();
            attachment.developerName = 'Attachment';
            attachment.isSelected = true;
            attachment.addProperty(new FlowObjectDataProperty({
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: this.newTitle.value,
                developerName: 'title',
                objectData: null,
                typeElementId: null,
                typeElementPropertyId: null}));
            attachment.addProperty(new FlowObjectDataProperty({
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: this.newMime,
                developerName: 'mime',
                objectData: null,
                typeElementId: null,
                typeElementPropertyId: null}));
            attachment.addProperty(new FlowObjectDataProperty({
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: this.newName,
                developerName: 'filename',
                objectData: null,
                typeElementId: null,
                typeElementPropertyId: null}));
            attachment.addProperty(new FlowObjectDataProperty({
                contentFormat: null,
                contentType: 'ContentDateTime',
                contentValue: this.newDate.toISOString(),
                developerName: 'date',
                objectData: null,
                typeElementId: null,
                typeElementPropertyId: null}));
            attachment.addProperty(new FlowObjectDataProperty({
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: this.newData,
                developerName: 'data',
                objectData: null,
                typeElementId: null,
                typeElementPropertyId: null}));

            const attList: FlowField = this.fields[this.attributes['AttachmentListField'].value];
            (attList.value as FlowObjectDataArray).addItem(attachment);
            // this.setStateValue(attachment);
            await this.updateValues([attList]);
            if (this.attributes['AddAttachmentOutcome'] && this.attributes['AddAttachmentOutcome'].value.length > 0 && this.outcomes[this.attributes['AddAttachmentOutcome'].value]) {
                await this.triggerOutcome(this.attributes['AddAttachmentOutcome'].value);
            }
            await this.loadValues();
            await this.loadModel();
            this.forceUpdate();
        }
        this.modalShown = false;

        this.forceUpdate();
    }

    downloadFile(attachment: FlowObjectData) {

    }

    render() {

        const caption: string = this.getAttribute('Title') || 'Attachments';
        const height = this.model.height + 'px';

        const style: React.CSSProperties = {};
        style.width = '100%';
        style.height = height;

        let addButton: JSX.Element;
        if (this.model.readOnly == false) {
            addButton = (<span className="glyphicon glyphicon-plus modal-dialog-header-button" title="Add Attachment" onClick={(e) => this.showModal} ></span>);
        }

        const attachments: JSX.Element[] = [];
        if (this.model.dataSource.items.length === 0) {
            attachments.push(<div className="at-no-attachements"> No attachments </div>);
        } else {
            for (const attachment of this.model.dataSource.items) {
                attachments.push(<div className="at-bubble">
                                    <a download={attachment.properties['filename'].value} href={attachment.properties['data'].value as string}>
                                        <span
                                            title="download file"
                                            className="glyphicon glyphicon-floppy-save"
                                            style={{fontSize: '16pt', marginLeft: '10px'}}></span>
                                    </a>
                                    <span className="attachment-title">{attachment.properties['title'].value}</span>
                                    <span className="attachment-date">{new Date(attachment.properties['date'].value as string).toLocaleString()}</span>
                                    <span className="attachment-file">{attachment.properties['filename'].value}</span>
                                </div>);
            }
        }

        let modal: JSX.Element;
        if (this.modalShown) {
            modal =  <ModalDialog onCloseRequest={this.closeModal}>
                        <div className="modal-dialog">
                            <div className="modal-dialog-header">
                                <div style={{float: 'left'}}>
                                    <span className="modal-dialog-header-title">Add a new document</span>
                                </div>
                                <div style={{float: 'right'}}>
                                    {addButton}
                                </div>
                            </div>
                            <div className="modal-dialog-body">
                                <div className="modal-dialog-body-client">
                                    <div className="modal-dialog-input-row">
                                        <span className="modal-dialog-input-label">Title</span>
                                        <input className="modal-dialog-input" ref={(newTitle) => { this.newTitle = newTitle; }} type="text" width="60px"></input>
                                    </div>
                                    <div className="modal-dialog-input-row">
                                        <span className="modal-dialog-input-label">File</span>
                                        <input
                                            className="modal-dialog-select"
                                            ref={(newFile) => { this.newFile = newFile; }}
                                            type="file"
                                            width="60px"
                                            onChange={(e: any) => {this.fileSelected(e); }}
                                            onClick={(e: any) => { e.target.value = null; }}
                                        ></input>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-dialog-button-bar">
                                <button className="modal-dialog-button-bar-button" title="Add Comment" onClick={(e) => this.closeModal(true)}>Add</button>
                                <button className="modal-dialog-button-bar-button" title="Cancel" onClick={(e) => this.closeModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </ModalDialog>;
        }

        return (
                <div className="at-list">
                    <div className="at-list-header">
                        <div style={{float: 'left'}}>
                            <span className="at-list-header-title">{caption}</span>
                        </div>
                        <div style={{float: 'right'}}>
                            <span className="glyphicon glyphicon-plus at-list-header-button" title="Add Comment" onClick={this.addAttachment}></span>
                        </div>

                    </div>
                    <div className="comment-list-body">
                       {attachments}
                    </div>
                    {modal}
               </div>
                );

    }
}

manywho.component.register('AttachmentTable', AttachmentTable);

export default AttachmentTable;
