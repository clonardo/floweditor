import { getActionUUID } from '~/components/flow/actions/helpers';
import { SendMsgFormState } from '~/components/flow/actions/sendmsg/SendMsgForm';
import { Types } from '~/config/typeConfigs';
import { SendMsg } from '~/flowTypes';
import { NodeEditorSettings } from '~/store/nodeEditor';

export const initializeForm = (settings: NodeEditorSettings): SendMsgFormState => {
    if (settings.originalAction && settings.originalAction.type === Types.send_msg) {
        const action = settings.originalAction as SendMsg;
        return {
            text: { value: action.text },
            quickReplies: { value: action.quick_replies || [] },
            sendAll: action.all_urns,
            valid: true
        };
    }

    return {
        text: { value: '' },
        quickReplies: { value: [] },
        sendAll: false,
        valid: false
    };
};

export const stateToAction = (settings: NodeEditorSettings, state: SendMsgFormState): SendMsg => {
    return {
        text: state.text.value,
        type: Types.send_msg,
        all_urns: state.sendAll,
        quick_replies: state.quickReplies.value,
        uuid: getActionUUID(settings, Types.send_msg)
    };
};

export const initializeLocalizedForm = (settings: NodeEditorSettings): SendMsgFormState => {
    // check if our form should use a localized action
    if (
        settings.originalAction &&
        settings.originalAction.type === Types.send_msg &&
        settings.localizations &&
        settings.localizations.length > 0
    ) {
        const localized = settings.localizations[0];
        if (localized.isLocalized()) {
            const action = settings.localizations[0].getObject() as SendMsg;
            return {
                text: { value: action.text },
                quickReplies: { value: action.quick_replies || [] },
                sendAll: action.all_urns,
                valid: true
            };
        }
    }

    return {
        text: { value: '' },
        quickReplies: { value: [] },
        sendAll: false,
        valid: false
    };
};
