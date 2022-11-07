import {authAPI, LoginParamsType, ResponseType} from 'api/todolists-api'
import {setAppStatusAC} from 'app/app-reducer'
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from 'utils/error-utils'
import {setIsLoggedInAC} from 'features/Login/auth-reducer'
import {call, put, takeEvery} from 'redux-saga/effects'

export function* authWatcherSaga() {
		yield takeEvery('AUTH/LOGIN', loginWatcherSaga)
		yield takeEvery('AUTH/LOGOUT', logoutWatcherSaga)
}


export function* loginWatcherSaga(action: ReturnType<typeof loginSagaActivator>) {
		yield put(setAppStatusAC('loading'))
		try {
				const data: ResponseType<{ userId?: number }> = yield call(authAPI.login, action.loginData)
				if (data.resultCode === 0) {
						yield put(setIsLoggedInAC(true))
						yield put(setAppStatusAC('succeeded'))
				} else {
						yield* handleServerAppErrorSaga(data)
				}
		} catch (e) {
				yield* handleServerNetworkErrorSaga(e)
		}
}

export const loginSagaActivator = (loginData: LoginParamsType) =>
		({type: 'AUTH/LOGIN', loginData} as const)

export function* logoutWatcherSaga(action: ReturnType<typeof logoutSagaActivator>) {
		yield put(setAppStatusAC('loading'))
		try {
				const data: ResponseType<{ userId?: number }> = yield call(authAPI.logout)
				if (data.resultCode === 0) {
						yield put(setIsLoggedInAC(false))
						yield put(setAppStatusAC('succeeded'))
				} else {
						yield* handleServerAppErrorSaga(data)
				}
		} catch (e) {
				yield* handleServerNetworkErrorSaga(e)
		}
}

export const logoutSagaActivator = () =>
		({type: 'AUTH/LOGOUT'})

