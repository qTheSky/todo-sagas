import {call, put, takeEvery} from 'redux-saga/effects'
import {setAppStatusAC} from 'app/app-reducer'
import {ResponseType, todolistsAPI, TodolistType} from 'api/todolists-api'
import {handleServerNetworkErrorSaga} from 'utils/error-utils'
import {
		addTodolistAC,
		changeTodolistEntityStatusAC,
		changeTodolistTitleAC,
		removeTodolistAC,
		setTodolistsAC
} from 'features/TodolistsList/todolists-reducer'
import {AxiosResponse} from 'axios'

export function* todolistsWatcherSaga() {
		yield takeEvery('TODOLISTS/FETCH-TODOLISTS', fetchTodolistsWatcherSaga)
		yield takeEvery('TODOLISTS/REMOVE-TODOLIST', removeTodolistWatcherSaga)
		yield takeEvery('TODOLISTS/ADD-TODOLIST', addTodolistWatcherSaga)
		yield takeEvery('TODOLISTS/CHANGE-TODOLIST-TITLE', changeTodolistTitleWatcherSaga)
}

export function* fetchTodolistsWatcherSaga(action: ReturnType<typeof fetchTodolists>) {
		yield put(setAppStatusAC('loading'))
		try {
				const res: AxiosResponse<TodolistType[]> = yield call(todolistsAPI.getTodolists)
				yield put(setTodolistsAC(res.data))
				yield put(setAppStatusAC('succeeded'))
		} catch (e) {
				yield	handleServerNetworkErrorSaga(e)
		}
}

export const fetchTodolists = () => ({type: 'TODOLISTS/FETCH-TODOLISTS'})

export function* removeTodolistWatcherSaga(action: ReturnType<typeof removeTodolistSagaActivator>) {
		yield put(setAppStatusAC('loading'))
		yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
		yield call(todolistsAPI.deleteTodolist, action.todolistId)
		yield put(removeTodolistAC(action.todolistId))
		yield put(setAppStatusAC('succeeded'))
}

export const removeTodolistSagaActivator = (todolistId: string) =>
		({type: 'TODOLISTS/REMOVE-TODOLIST', todolistId})

export function* addTodolistWatcherSaga(action: ReturnType<typeof addTodolistSagaActivator>) {
		yield put(setAppStatusAC('loading'))
		const res: AxiosResponse<ResponseType<{ item: TodolistType }>> = yield call(todolistsAPI.createTodolist, action.title)
		yield put(addTodolistAC(res.data.data.item))
		yield put(setAppStatusAC('succeeded'))
}

export const addTodolistSagaActivator = (title: string) =>
		({type: 'TODOLISTS/ADD-TODOLIST', title})

export function* changeTodolistTitleWatcherSaga(action: ReturnType<typeof changeTodolistTitleSagaActivator>) {
		yield call(todolistsAPI.updateTodolist, action.id, action.title)
		yield put(changeTodolistTitleAC(action.id, action.title))

}

export const changeTodolistTitleSagaActivator = (id: string, title: string) =>
		({type: 'TODOLISTS/CHANGE-TODOLIST-TITLE', id, title})