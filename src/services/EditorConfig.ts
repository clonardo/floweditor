import __flow_editor_config__ from '../flowEditorConfig';
import ChangeGroupCompEnhanced from '../components/actions/ChangeGroup/ChangeGroupComp';
import ChangeGroupForm from '../components/actions/ChangeGroup/ChangeGroupForm';
import SaveFlowResultCompEnhanced from '../components/actions/SaveFlowResult/SaveFlowResultComp';
import SaveFlowResultForm from '../components/actions/SaveFlowResult/SaveFlowResultForm';
import SaveToContactCompEnhanced from '../components/actions/SaveToContact/SaveToContactComp';
import SaveToContactForm from '../components/actions/SaveToContact/SaveToContactForm';
import ReplyComp from '../components/actions/Reply/ReplyComp';
import ReplyForm from '../components/actions/Reply/ReplyForm';
import WebhookCompEnhanced from '../components/actions/Webhook/WebhookComp';
// import { StartFlowComp } from '../components/actions/StartFlow';
import SendEmailCompEnhanced from '../components/actions/SendEmail/SendEmailComp';
import SendEmailForm from '../components/actions/SendEmail/SendEmailForm';
import { SwitchRouterForm } from '../components/routers/SwitchRouter';
import { SubflowForm } from '../components/routers/Subflow';
import { WebhookForm } from '../components/routers/Webhook';

export enum EMode {
    EDITING = 0x1,
    TRANSLATING = 0x2,
    ALL = EDITING | TRANSLATING
}

export interface IEndpoints {
    fields: string;
    groups: string;
    engine: string;
    contacts: string;
    flows: string;
    activity: string;
}

export interface ILanguages {
    [iso: string]: string;
}

export interface IType {
    type: string;
    name: string;
    description: string;
    form: { new (props: any): any };
    allows(mode: EMode): boolean;
    component?: { new (props: any): any };
    advanced?: EMode;
    aliases?: string[];
}

export interface ITypeMap {
    [propName: string]: IType;
}

export interface IOperator {
    type: string;
    verboseName: string;
    operands: number;
    // Default category name to use if specified
    categoryName?: string;
}

export interface IOperatorMap {
    [propName: string]: IOperator;
}

export type TGetTypeConfig = (type: string) => IType;

export type TGetOperatorConfig = (type: string) => IOperator;

const TYPE_CONFIG_LIST: IType[] = [
    /** Actions */
    {
        type: 'reply',
        name: 'Send Message',
        description: 'Send them a message',
        form: ReplyForm,
        component: ReplyComp,
        advanced: EMode.EDITING,
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    },
    // { type: 'msg', name: 'Send Message', description: 'Send somebody else a message', form: SendMessageForm, component: SendMessage },
    {
        type: 'add_to_group',
        name: 'Add to Group',
        description: 'Add them to a group',
        form: ChangeGroupForm,
        component: ChangeGroupCompEnhanced,
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    },
    {
        type: 'remove_from_group',
        name: 'Remove from Group',
        description: 'Remove them from a group',
        form: ChangeGroupForm,
        component: ChangeGroupCompEnhanced,
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    },
    {
        type: 'save_contact_field',
        name: 'Update Contact',
        description: 'Update the contact',
        form: SaveToContactForm,
        component: SaveToContactCompEnhanced,
        aliases: ['update_contact'],
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    },
    {
        type: 'send_email',
        name: 'Send Email',
        description: 'Send an email',
        form: SendEmailForm,
        component: SendEmailCompEnhanced,
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    },
    {
        type: 'save_flow_result',
        name: 'Save Flow Result',
        description: 'Save a result for this flow',
        form: SaveFlowResultForm,
        component: SaveFlowResultCompEnhanced,
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    },
    // {type: 'add_label', name: 'Add Label', description: 'Label the message', component: Missing},
    // {type: 'set_preferred_channel', name: 'Set Preferred Channel', description: 'Set their preferred channel', component: Missing},
    /** Hybrids */
    {
        type: 'call_webhook',
        name: 'Call Webhook',
        description: 'Call a webook',
        form: WebhookForm,
        component: WebhookCompEnhanced,
        advanced: EMode.EDITING,
        aliases: ['webhook'],
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    },
    // {
    //     type: 'start_flow',
    //     name: 'Run Flow',
    //     description: 'Run another flow',
    //     form: SubflowForm,
    //     component: StartFlowComp,
    //     aliases: ['subflow'],
    //     allows(mode: EMode): boolean {
    //         return (this.advanced & mode) === mode;
    //     }
    // },

    /** Routers */
    {
        type: 'expression',
        name: 'Split by Expression',
        description: 'Split by a custom expression',
        form: SwitchRouterForm,
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    },
    {
        type: 'wait_for_response',
        name: 'Wait for Response',
        description: 'Wait for them to respond',
        form: SwitchRouterForm,
        advanced: EMode.TRANSLATING,
        aliases: ['switch'],
        allows(mode: EMode): boolean {
            return (this.advanced & mode) === mode;
        }
    }
    // {type: 'random', name: 'Random Split', description: 'Split them up randomly', form: RandomRouterForm}
];

const OPERATOR_CONFIG_LIST: IOperator[] = [
    { type: 'has_any_word', verboseName: 'has any of the words', operands: 1 },
    { type: 'has_all_words', verboseName: 'has all of the words', operands: 1 },
    { type: 'has_phrase', verboseName: 'has the phrase', operands: 1 },
    { type: 'has_only_phrase', verboseName: 'has only the phrase', operands: 1 },
    { type: 'has_beginning', verboseName: 'starts with', operands: 1 },
    {
        type: 'has_number_between',
        verboseName: 'has a number between',
        operands: 2
    },
    { type: 'has_number_lt', verboseName: 'has a number below', operands: 1 },
    {
        type: 'has_number_lte',
        verboseName: 'has a number at or below',
        operands: 1
    },
    { type: 'has_number_eq', verboseName: 'has a number equal to', operands: 1 },
    {
        type: 'has_number_gte',
        verboseName: 'has a number at or above',
        operands: 1
    },
    { type: 'has_number_gt', verboseName: 'has a number above', operands: 1 },
    { type: 'has_date', verboseName: 'has a date', operands: 0 },
    { type: 'has_date_lt', verboseName: 'has a date before', operands: 1 },
    { type: 'has_date_eq', verboseName: 'has a date equal to', operands: 1 },
    { type: 'has_date_gt', verboseName: 'has a date after', operands: 1 },
    { type: 'has_run_status', verboseName: 'has a run status of', operands: 1 },
    { type: 'has_group', verboseName: 'is in the group', operands: 1 },
    {
        type: 'has_text',
        verboseName: 'has some text',
        operands: 0,
        categoryName: 'Has Text'
    },
    {
        type: 'has_number',
        verboseName: 'has a number',
        operands: 0,
        categoryName: 'Number'
    },
    {
        type: 'has_phone',
        verboseName: 'has a phone number',
        operands: 0,
        categoryName: 'Phone'
    },
    {
        type: 'has_email',
        verboseName: 'has an email',
        operands: 0,
        categoryName: 'Email'
    },
    {
        type: 'has_error',
        verboseName: 'has an error',
        operands: 0,
        categoryName: 'Error'
    },
    {
        type: 'has_value',
        verboseName: 'is not empty',
        operands: 0,
        categoryName: 'Not Empty'
    }
];

class EditorConfig {
    public typeConfigList: IType[] = TYPE_CONFIG_LIST;
    public operatorConfigList: IOperator[] = OPERATOR_CONFIG_LIST;
    public actionConfigList: IType[];

    public typeConfigMap: ITypeMap;
    public operatorConfigMap: IOperatorMap;

    public endpoints: IEndpoints = __flow_editor_config__.endpoints;
    public languages: ILanguages = __flow_editor_config__.languages;

    constructor() {
        this.actionConfigList = this.filterActionConfigs();
        this.typeConfigMap = this.mapTypeConfigs();
        this.operatorConfigMap = this.mapOperatorConfigs();

        this.getTypeConfig = this.getTypeConfig.bind(this);
        this.getOperatorConfig = this.getOperatorConfig.bind(this);
    }

    private filterActionConfigs(): IType[] {
        return this.typeConfigList.filter(
            ({ form: { prototype } }) => !(prototype instanceof SwitchRouterForm)
        );
    }

    private mapTypeConfigs(): ITypeMap {
        return this.typeConfigList.reduce((typeConfigMap: ITypeMap, typeConfig: IType) => {
            typeConfigMap = Object.assign(typeConfigMap, { [typeConfig.type]: typeConfig });
            if (typeConfig.hasOwnProperty('aliases') && typeConfig.aliases) {
                typeConfig.aliases.forEach(
                    (alias: string) =>
                        (typeConfigMap = Object.assign(typeConfigMap, { [alias]: typeConfig }))
                );
            }
            return typeConfigMap;
        }, {});
    }

    private mapOperatorConfigs(): IOperatorMap {
        return this.operatorConfigList.reduce(
            (operatorConfigMap: IOperatorMap, operatorConfig: IOperator) =>
                Object.assign(operatorConfigMap, { [operatorConfig.type]: operatorConfig }),
            {}
        );
    }

    /**
    * Shortcut for constant lookup of type config in type configs map
    * @param {string} type - The type of the type config to return, e.g. 'reply'
    * @returns {Object} - The type config found at typeConfigs[type] or -1
    */
    public getTypeConfig(type: string): IType {
        if (this.typeConfigMap.hasOwnProperty(type)) {
            return this.typeConfigMap[type];
        }
    }

    /**
    * Shortcut for constant lookup of operator config in operator configs map
    * @param {string} type - The type of the operator config to return, e.g. 'reply'
    * @returns {Object} - The operator config found at operatorConfigs[type] or -1
    */
    public getOperatorConfig(type: string): IOperator {
        if (this.operatorConfigMap.hasOwnProperty(type)) {
            return this.operatorConfigMap[type];
        }
    }
}

export default EditorConfig;
