import { composeComponentTestUtils } from '../../../testUtils/index';
import AddLabelsComp, { MAX_TO_SHOW } from './AddLabels';
import { AddLabels } from '../../../flowTypes';
import { add_input_labels } from '../Action/Action.scss';
import { Types } from '../../../config/typeConfigs';

const labels = [
    'Help',
    'New',
    'Feedback',
    'Needs Attention',
    'Running Out of Plausible Label Names'
];

const baseProps: AddLabels = {
    type: Types.add_input_labels,
    uuid: `${Types.add_input_labels}-0`,
    labels: labels.map((name, idx) => ({ name, uuid: `label-${idx}` }))
};

const { setup } = composeComponentTestUtils(AddLabelsComp, baseProps);

describe(AddLabelsComp.name, () => {
    it('should display labels on action', () => {
        const { wrapper } = setup();

        // Assert that we're displaying the max labels
        // we want to display plus an ellipses.
        expect(wrapper.find('div').length).toBe(MAX_TO_SHOW + 1);
        expect(wrapper).toMatchSnapshot();
    });
});
