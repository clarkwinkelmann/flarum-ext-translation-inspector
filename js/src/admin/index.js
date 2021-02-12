import app from 'flarum/app';

/* global m */

app.initializers.add('clarkwinkelmann-translation-inspector', () => {
    app.extensionData
        .for('clarkwinkelmann-translation-inspector')
        .registerPermission({
            icon: 'fas fa-highlighter',
            label: app.translator.trans('clarkwinkelmann-translation-inspector.admin.permissions.inspect'),
            permission: 'clarkwinkelmann-translation-inspector.inspect',
            allowGuest: true,
        }, 'view');
});
