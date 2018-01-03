import ACTIONS from './actions';

export default (prevState, action) => {
	let stateChanges;

	switch (action.type) {
		case ACTIONS.UPDATE_COMPLETE:
			stateChanges = {
				total: action.total,
				results: action.results,
				updateInProgress: false
			};
			return { ...prevState, ...stateChanges };
		case ACTIONS.RESET_PROGRESS:
			stateChanges = { updateProgress: 0, updateInProgress: false };
			return { ...prevState, ...stateChanges };
		case ACTIONS.UPDATE_PROGRESS:
			stateChanges = { updateProgress: action.progress, updateInProgress: true };
			return { ...prevState, ...stateChanges };
		case ACTIONS.TOGGLE_AUTO_UPDATE:
			stateChanges = { autoUpdate: !prevState.autoUpdate };
			return { ...prevState, ...stateChanges };
		case ACTIONS.SET_AUTO_UPDATE:
			stateChanges = { autoUpdate: action.autoUpdate };
			return { ...prevState, ...stateChanges };
		case ACTIONS.CURRENCIES_UPDATE:
			stateChanges = { currencies: action.currencies };
			return { ...prevState, ...stateChanges };
		case ACTIONS.CONFIG_VALIDATION:
			stateChanges = { validConfig: action.validConfig, validationError: action.validationError };
			return { ...prevState, ...stateChanges };
		case ACTIONS.CHANGE_AUTO_UPDATE_INTERVAL:
			stateChanges = { autoUpdateInterval: action.autoUpdateInterval };
			return { ...prevState, ...stateChanges };
		default: return prevState;
	}
};