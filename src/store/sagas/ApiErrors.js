import { takeEvery, call } from "redux-saga/effects";
import * as actions from "../actions";
import { toast } from "react-toastify";

const ApiErrors = [watchApiError];

function* watchApiError() {
  yield takeEvery(actions.API_ERROR, apiErrorReceived);
}

function* apiErrorReceived(action) {
  yield call(toast.error, `Error Received: ${action.error}`);
}

export default ApiErrors;
