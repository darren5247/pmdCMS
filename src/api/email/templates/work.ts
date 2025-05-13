import { EmailTemplate } from './types';

export const workTemplates: Record<string, EmailTemplate> = {
    newWork: {
        subject: 'New Work Added: {{workTitle}}',
        html: `
            <h1>New Work Added</h1>
            <p>Hello {{userName}},</p>
            <p>You have added a new work to Piano Music Database.</p>
            <br>
            <p>Title: {{workTitle}}</p>
            <p>Composers: {{composers}}</p>
            <p>Level: {{level}}</p>
            <p>Era: {{era}}</p>
            <a href="https://pianomusicdatabase.com/work/{{workTitle}}?id={{workId}}" target="_blank" title="Preview Work"
            style="
            font-style: normal;
            font-weight: normal;
            line-height: 1.15;
            text-decoration: none;
            word-break: break-word;
            border-style: solid;
            word-wrap: break-word;
            display: block;
            -webkit-text-size-adjust: none;
            background-color: #7f1d1d;
            border-color: #7f1d1d;
            border-radius: 8px;
            border-width: 0px;
            color: #ffffff;
            font-family: Verdana;
            font-size: 16px;
            height: 18px;
            mso-hide: all;
            padding-bottom: 12px;
            padding-left: 5px;
            padding-right: 5px;
            padding-top: 12px;
            width: 280px;
            "
            >
                <span>Preview Work</span>
            </a>
            <br>
            <p>Thank you for your contribution to Piano Music Database!</p>
        `,
        text: 'New Work Added\n\nHello {{userName}},\nYou have added a new work to Piano Music Database.\n\nTitle: {{workTitle}}\nComposers: {{composers}}\nLevel: {{level}}\nEra: {{era}}\n\nPreview Work\n\nThank you for your contribution to Piano Music Database!',
    },
    workPublishStatusChanged: {
        subject: 'Your Work Visibility has Changed - Piano Music Database',
        html: `
            <h1>Your work visibility has changed on PMD:</h1>
            <br>
            <p>Work: {{workTitle}}</p>
            <p>Composers: {{composers}}</p>
            <p>Status: {{publishStatus}}</p>
            <br>
            <p>Thank you for your contribution to Piano Music Database!</p>
        `,
        text: 'Your Work Visibility has Changed - Piano Music Database\n\nWork: {{workTitle}}\nComposers: {{composers}}\nStatus: {{publishStatus}}\n\nThank you for your contribution to Piano Music Database!'
    }
}; 