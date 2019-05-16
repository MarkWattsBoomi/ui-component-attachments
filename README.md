# Attachment Handler

A component that displays a list of files attached to the current flow.

It holds the attachments in a list Value.

You must define a Type in flow as follows: =

        Attachment
        {
                "title"         String      Contains the user entered title
                "filename"      String      The OS name of the file. also used when downloading
                "date"          DateTime    The OS file date/time
                "mime"          String      The mime type of the file
                "data"          String      the data-uri of the file, the file data
        }

You must define a new list value of the Attachment type to hold the attachments.

## Setup

- Grab the files from the /build folder and import into your tenant.

- Add the files to your player code like this: -

        requires: ['core', 'bootstrap3'],
        customResources: [
                'https://s3.amazonaws.com/files-manywho-com/tenant-id/attachment.css',
                'https://s3.amazonaws.com/files-manywho-com/tenant-id/attachment.js'
                ],


- Add a component to your page, any type, save it then change it's "componentType" to "AttachmentTable" in the metadata editor and save it.
e.g. 
            "componentType": "AttachmentTable"

- Set the component's datasource to the Attachment list you created.

- Don't set the component's state, it's not used.

- Add an attribute to the component called "AttachmentListField" and set it's value to the name of the list that holds the attachment.


## Extra Configuration

You can add attributes to the component to control it's appearance: -

- Title  The text shown in the component's header bar.

- AddAttachmentOutcome an optional outcome's name which if specified will be triggered each time an attachment is added.
