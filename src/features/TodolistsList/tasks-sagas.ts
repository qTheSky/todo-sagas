import {call, put, takeEvery, select} from 'redux-saga/effects'
import {setAppStatusAC} from 'app/app-reducer'
import {AxiosResponse} from 'axios'
import {GetTasksResponse, ResponseType, TaskType, todolistsAPI, UpdateTaskModelType} from 'api/todolists-api'
import {
		addTaskAC,
		removeTaskAC,
		setTasksAC, TasksStateType,
		UpdateDomainTaskModelType,
		updateTaskAC
} from 'features/TodolistsList/tasks-reducer'
import {handleServerAppErrorSaga, handleServerNetworkError, handleServerNetworkErrorSaga} from 'utils/error-utils'
import {AppRootStateType} from 'app/store'

export function* tasksWatcherSaga() {
		yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga)
		yield takeEvery('TASKS/REMOVE-TASK', removeTaskWorkerSaga)
		yield takeEvery('TASKS/ADD-TASK', addTaskWorkerSaga)
		yield takeEvery('TASKS/UPDATE-TASK', updateTaskWorkerSaga)
}

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
		yield put(setAppStatusAC('loading'))
		const data: GetTasksResponse = yield call(todolistsAPI.getTasks, action.todolistId)
		const tasks = data.items
		yield put(setTasksAC(tasks, action.todolistId))
		yield put(setAppStatusAC('succeeded'))
}

export const fetchTasks = (todolistId: string) =>
		({type: 'TASKS/FETCH-TASKS', todolistId})

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTaskAc>) {
		const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
		yield put(removeTaskAC(action.taskId, action.todolistId))
}

export const removeTaskAc = (todolistId: string, taskId: string) =>
		({type: 'TASKS/REMOVE-TASK', todolistId, taskId})


export function* addTaskWorkerSaga(action: ReturnType<typeof addTaskSagaActivator>) {
		yield put(setAppStatusAC('loading'))
		try {
				const data: ResponseType<{ item: TaskType }> = yield call(todolistsAPI.createTask, action.todolistId, action.title)
				if (data.resultCode === 0) {
						const task = data.data.item
						yield put(addTaskAC(task))
						yield put(setAppStatusAC('succeeded'))
				} else {
						yield* handleServerAppErrorSaga(data)
				}
		} catch (e) {
				yield* handleServerNetworkErrorSaga(e)
		}
}

export const addTaskSagaActivator = (todolistId: string, title: string) =>
		({type: 'TASKS/ADD-TASK', todolistId, title} as const)

const getTasks = (state: AppRootStateType) => state.tasks

export function* updateTaskWorkerSaga(action: ReturnType<typeof updateTaskSagaActivator>) {
		const tasks: TasksStateType = yield select(getTasks)
		const task = tasks[action.todolistId].find(t => t.id === action.taskId)
		if (!task) {
				//throw new Error("task not found in the state");
				console.warn('task not found in the state')
				return
		}

		const apiModel: UpdateTaskModelType = {
				deadline: task.deadline,
				description: task.description,
				priority: task.priority,
				startDate: task.startDate,
				title: task.title,
				status: task.status,
				...action.domainModel
		}

		try {
				const res: AxiosResponse<ResponseType<TaskType>> = yield call(todolistsAPI.updateTask, action.todolistId, action.taskId, apiModel)
				if (res.data.resultCode === 0) {
						yield put(updateTaskAC(action.taskId, action.domainModel, action.todolistId))
				} else {
						yield handleServerAppErrorSaga(res.data)
				}
		} catch (e) {
				yield handleServerNetworkErrorSaga(e)
		}
}

export const updateTaskSagaActivator = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
		({type: 'TASKS/UPDATE-TASK', todolistId, taskId, domainModel})