import { EmailTemplate } from './types';

export const editTemplates: Record<string, EmailTemplate> = {
    editReceived: {
        subject: '{{messagePrefix}} on Piano Music Database',
        html: `
            <h1>{{messagePrefix}} on PMD</h1>
            <br>
            <p>Work: {{workTitle}}</p>
            <p>Edit Type: {{editType}}</p>
            <p>Field: {{editField}}</p>
            <p>Reason: {{reason}}</p>
            <p>Current Content: {{currentContent}}</p>
            <p>New Content: {{newContent}}</p>
            <br>
            <p>Thank you for your contribution to the Piano Music Database!</p>
        `,
        text: '{{messagePrefix}} on PMD\n\nWork: {{workTitle}}\nEdit Type: {{editType}}\nField: {{editField}}\nReason: {{reason}}\nCurrent Content: {{currentContent}}\nNew Content: {{newContent}}\n\nThank you for your contribution to the Piano Music Database!',
    },
    workEdited: {
        subject: 'Your work was edited on Piano Music Database',
        html: `
            <h1>Your work was edited on PMD</h1>
            <br>
            <p>Work: {{workTitle}}</p>
            <p>Editor: {{editorName}}</p>
            <p>Edit Type: {{editType}}</p>
            <p>Field: {{editField}}</p>
            <p>Reason: {{reason}}</p>
            <p>Current Content: {{currentContent}}</p>
            <p>New Content: {{newContent}}</p>
            <br>
            <p>Thank you for your contribution to the Piano Music Database!</p>
        `,
        text: 'Your work was edited on PMD\n\nWork: {{workTitle}}\nEditor: {{editorName}}\nEdit Type: {{editType}}\nField: {{editField}}\nReason: {{reason}}\nCurrent Content: {{currentContent}}\nNew Content: {{newContent}}\n\nThank you for your contribution to the Piano Music Database!',
    },
    editStatusWorkOwner: {
        subject: 'Your work was edited on PMD',
        html: `
            <h3>Your work was edited:</h3>
            <br>
            <p>Status: {{status}}</p>
            <p>Work: {{workTitle}}</p>
            <p>Type: {{type}}</p>
            <p>Field: {{field}}</p>
            <p>Current Content: {{currentContent}}</p>
            <p>New Content: {{newContent}}</p>
            <br>
            <p>Thank you for your contribution to the Piano Music Database!</p>
        `,
        text: `
            Your work was edited:

            Status: {{status}}
            Work: {{workTitle}}
            Type: {{type}}
            Field: {{field}}
            Current Content: {{currentContent}}
            New Content: {{newContent}}

            Thank you for your contribution to the Piano Music Database!
        `
    },
    editStatusEditor: {
        subject: 'Your edit status was updated on PMD',
        html: `
            <p>Your edit status was updated:</p>
            <p>Status: {{status}}</p>
            <p>Work: {{workTitle}}</p>
            <p>Type: {{type}}</p>
            <p>Field: {{field}}</p>
            <p>Current Content: {{currentContent}}</p>
            <p>New Content: {{newContent}}</p>
        `,
        text: `
            Your edit status was updated:
            Status: {{status}}
            Work: {{workTitle}}
            Type: {{type}}
            Field: {{field}}
            Current Content: {{currentContent}}
            New Content: {{newContent}}
        `
    }
}; 