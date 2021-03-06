import { react as bindCallbacks } from 'auto-bind';
import * as React from 'react';
import Dialog, { ButtonSet } from '~/components/dialog/Dialog';
import { RouterFormProps } from '~/components/flow/props';
import { GROUP_LABEL } from '~/components/flow/routers/constants';
import { nodeToState, stateToNode } from '~/components/flow/routers/groups/helpers';
import OptionalTextInput from '~/components/form/optionaltext/OptionalTextInput';
import GroupsElement from '~/components/form/select/groups/GroupsElement';
import TypeList from '~/components/nodeeditor/TypeList';
import { fakePropType } from '~/config/ConfigProvider';
import { Asset } from '~/services/AssetService';
import { AssetArrayEntry, FormState, mergeForm, StringEntry } from '~/store/nodeEditor';
import { validate, validateRequired } from '~/store/validators';

// TODO: Remove use of Function
// tslint:disable:ban-types
export interface GroupsRouterFormState extends FormState {
    groups: AssetArrayEntry;
    resultName: StringEntry;
}

export default class GroupsRouterForm extends React.Component<
    RouterFormProps,
    GroupsRouterFormState
> {
    public static contextTypes = {
        endpoints: fakePropType,
        assetService: fakePropType
    };

    constructor(props: RouterFormProps) {
        super(props);
        this.state = nodeToState(this.props.nodeSettings);

        bindCallbacks(this, {
            include: [/^handle/]
        });
    }

    private handleGroupsChanged(groups: Asset[]): void {
        this.handleUpdate({ groups });
    }

    private handleResultNameChanged(resultName: string): void {
        this.handleUpdate({ resultName });
    }

    private handleUpdate(keys: { groups?: Asset[]; resultName?: string }): boolean {
        const updates: Partial<GroupsRouterFormState> = {};

        if (keys.hasOwnProperty('groups')) {
            updates.groups = validate('Groups', keys.groups, [validateRequired]);
        }

        if (keys.hasOwnProperty('resultName')) {
            updates.resultName = { value: keys.resultName };
        }

        const updated = mergeForm(this.state, updates);
        this.setState(updated);
        return updated.valid;
    }

    private handleSave(): void {
        if (this.state.valid) {
            this.props.updateRouter(stateToNode(this.props.nodeSettings, this.state));
            this.props.onClose(false);
        }
    }

    private getButtons(): ButtonSet {
        return {
            primary: { name: 'Ok', onClick: this.handleSave },
            secondary: { name: 'Cancel', onClick: () => this.props.onClose(true) }
        };
    }

    public render(): JSX.Element {
        const typeConfig = this.props.typeConfig;

        return (
            <Dialog
                title={typeConfig.name}
                headerClass={typeConfig.type}
                buttons={this.getButtons()}
            >
                <TypeList
                    __className=""
                    initialType={typeConfig}
                    onChange={this.props.onTypeChange}
                />
                <p>{GROUP_LABEL}</p>
                <GroupsElement
                    name="Groups"
                    assets={this.context.assetService.getGroupAssets()}
                    add={false}
                    onChange={this.handleGroupsChanged}
                    entry={this.state.groups}
                />
                <OptionalTextInput
                    name="Result Name"
                    value={this.state.resultName}
                    onChange={this.handleResultNameChanged}
                    toggleText="Save as.."
                    helpText="By naming the result, you can reference it later using @run.results.whatever_the_name_is"
                />
            </Dialog>
        );
    }
}
