import app from 'flarum/app';
import {extend, override} from 'flarum/extend';
import icon from 'flarum/helpers/icon';
import Button from 'flarum/components/Button';
import IndexPage from 'flarum/components/IndexPage';
import HeaderPrimary from 'flarum/components/HeaderPrimary';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import CommentPost from 'flarum/components/CommentPost';
import Translator from 'flarum/Translator';
import InspectTranslationModal from './components/InspectTranslationModal';

/* global m */

let selecting = false;

function wrapTranslation(translation, vdom) {
    return m('span.TranslationInspectorText', {
        onclick(event) {
            event.stopPropagation();
            event.preventDefault();
            selecting = false;

            app.modal.show(InspectTranslationModal, {
                translation,
            });
        },
    }, vdom);
}

app.initializers.add('clarkwinkelmann-translation-inspector', function () {
    extend(IndexPage.prototype, 'sidebarItems', function (items) {
        items.add('translation-suggestions', Button.component({
            className: 'Button Button--link',
            icon: 'fas fa-highlighter',
            onclick() {
                selecting = true;
            },
        }, app.translator.trans('clarkwinkelmann-translation-inspector.forum.nav.inspect')));
    });

    extend(HeaderPrimary.prototype, 'items', function (items) {
        if (selecting) {
            items.add('translation-suggestions', m('.TranslationInspectorTooltip', [
                icon('fas fa-highlighter'),
                m('h3', app.translator.trans('clarkwinkelmann-translation-inspector.forum.tooltip.title')),
                m('p', app.translator.trans('clarkwinkelmann-translation-inspector.forum.tooltip.description')),
                m('p', m('a', {
                    href: '#',
                    onclick(event) {
                        event.preventDefault();
                        selecting = false;
                    },
                }, app.translator.trans('clarkwinkelmann-translation-inspector.forum.tooltip.cancel'))),
            ]));
        }
    });

    extend(DiscussionListItem.prototype, 'oninit', function () {
        this.subtree.check(() => selecting);
    });

    extend(CommentPost.prototype, 'oninit', function () {
        this.subtree.check(() => selecting);
    });

    override(Translator.prototype, 'trans', function (original, id, parameters) {
        const vdom = original(id, parameters);

        if (selecting) {
            return wrapTranslation(id, vdom);
        }

        return vdom;
    });

    override(Translator.prototype, 'transChoice', function (original, id, number, parameters) {
        const vdom = original(id, number, parameters);

        if (selecting) {
            return wrapTranslation(id, vdom);
        }

        return vdom;
    });
});
