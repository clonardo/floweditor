import { react as bindCallbacks } from 'auto-bind';
import * as React from 'react';
import Select, { Option } from 'react-select';
import CheckboxElement from '~/components/form/checkbox/CheckboxElement';
import * as styles from '~/components/form/timeout/TimeoutControl.scss';
import { renderIf } from '~/utils';

export const TIMEOUT_OPTIONS = [
    { value: 60, label: '1 minutes' },
    { value: 120, label: '2 minutes' },
    { value: 180, label: '3 minutes' },
    { value: 240, label: '4 minutes' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 900, label: '15 minutes' },
    { value: 3600, label: '1 hours' },
    { value: 7200, label: '2 hours' },
    { value: 10800, label: '3 hours' },
    { value: 21600, label: '6 hours' },
    { value: 43200, label: '12 hours' },
    { value: 64800, label: '18 hours' },
    { value: 86400, label: '1 days' },
    { value: 172800, label: '2 days' },
    { value: 259200, label: '3 days' },
    { value: 604800, label: '1 week' }
];

export const DEFAULT_TIMEOUT = TIMEOUT_OPTIONS[4];

export const ellipsize = (str: string) => `${str}...`;

export interface TimeoutControlProps {
    timeout: number;
    onChanged(timeout: number): void;
}

export default class TimeoutControl extends React.Component<TimeoutControlProps> {
    constructor(props: TimeoutControlProps) {
        super(props);
        bindCallbacks(this, {
            include: [/^handle/]
        });
    }

    private getSelected(timeout: number): Option<number> {
        for (const [idx, { value }] of TIMEOUT_OPTIONS.entries()) {
            if (value === timeout) {
                return TIMEOUT_OPTIONS[idx];
            }
        }
        return null;
    }

    private isChecked(): boolean {
        return this.props.timeout > 0;
    }

    private getInstructions(): string {
        const base = 'Continue when there is no response';
        return this.isChecked() ? `${base} for` : ellipsize(base);
    }

    private handleChecked(): void {
        if (this.props.timeout > 0) {
            this.props.onChanged(0);
        } else {
            this.props.onChanged(DEFAULT_TIMEOUT.value);
        }
    }

    private handleTimeoutChanged(selected: Option): void {
        this.props.onChanged(selected.value as number);
    }

    public render(): JSX.Element {
        return (
            <div className={styles.timeoutControlContainer}>
                <div className={styles.leftSection}>
                    <CheckboxElement
                        name="Timeout"
                        checked={this.isChecked()}
                        description={this.getInstructions()}
                        checkboxClassName={styles.checkbox}
                        onChange={this.handleChecked}
                    />
                </div>
                {renderIf(this.isChecked())(
                    <Select
                        joinValues={true}
                        name="timeout"
                        className="select-small-timeout"
                        clearable={false}
                        searchable={false}
                        value={this.getSelected(this.props.timeout)}
                        onChange={this.handleTimeoutChanged}
                        options={TIMEOUT_OPTIONS}
                    />
                )}
            </div>
        );
    }
}
