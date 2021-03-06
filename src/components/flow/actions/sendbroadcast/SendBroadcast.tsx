import * as React from 'react';
import { getRecipients, renderAssetList } from '~/components/flow/actions/helpers';
import { BroadcastMsg } from '~/flowTypes';

import * as styles from '~/components/flow/actions/sendbroadcast/SendBroadcast.scss';

export const PLACEHOLDER = 'Send a message to the contact';

const MAX_TO_SHOW = 3;

const SendBroadcastComp: React.SFC<BroadcastMsg> = (action: BroadcastMsg): JSX.Element => {
    const assets = getRecipients(action);
    if (action.text) {
        return (
            <div className={styles.node}>
                <div className={styles.to}>{renderAssetList(assets, MAX_TO_SHOW)}</div>
                <div className={styles.message}>{action.text}</div>
            </div>
        );
    }
    return <div className="placeholder">{PLACEHOLDER}</div>;
};

export default SendBroadcastComp;
