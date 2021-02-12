import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import LinkButton from 'flarum/components/LinkButton';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

/* global m */

export default class InspectTranslationModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.inspection = null;

        app.request({
            url: app.forum.attribute('apiUrl') + '/inspect-translation',
            method: 'GET',
            params: {
                key: vnode.attrs.translation,
            },
        }).then(response => {
            this.inspection = response;
            m.redraw();
        });
    }

    className() {
        return 'Modal--small TranslationInspectorModal';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-translation-inspector.forum.modal.title');
    }

    content() {
        if (!this.inspection) {
            return LoadingIndicator.component();
        }

        return m('.Modal-body', [
            m('dl.TranslationInspectorKey', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.forum.modal.key')),
                m('dd', this.attrs.translation),
            ]),
            m('dl.TranslationInspectorOriginal', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.forum.modal.original')),
                m('dd', this.inspection.englishText),
            ]),
            m('dl.TranslationInspectorActual', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.forum.modal.actual')),
                m('dd', this.inspection.text),
            ]),
            m('dl.TranslationInspectorExtension', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.forum.modal.extension')),
                this.inspection.extension ? m('dd', [
                    m('span.TranslationInspectorExtensionIcon', {
                        style: this.inspection.extension.icon,
                    }),
                    m('span.TranslationInspectorExtensionTitle', this.inspection.extension.title),
                    m('span.TranslationInspectorExtensionName', this.inspection.extension.name),
                ]) : m('dd', app.translator.trans('clarkwinkelmann-translation-inspector.forum.modal.extension-unknown')),
            ]),
            this.inspection.file ? m('dl.TranslationInspectorPath', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.forum.modal.path')),
                m('dd', this.filePath()),
            ]) : null,
            this.inspection.url ? LinkButton.component({
                className: 'Button Button--block TranslationInspectorEditButton',
                icon: 'fab fa-github',
                href: this.inspection.url,
                external: true,
                target: '_blank',
                rel: 'nofollow noopener',
            }, app.translator.trans('clarkwinkelmann-translation-inspector.forum.modal.edit')) : null,
        ]);
    }

    filePath() {
        const path = this.inspection.file.path + (this.inspection.file.line ? ':' + this.inspection.file.line : '');

        if (this.inspection.url) {
            return m('a', {
                href: this.inspection.url,
                external: true,
                target: '_blank',
            }, path);
        }

        return path;
    }
}
