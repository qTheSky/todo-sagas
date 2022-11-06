import {addTaskWorkerSaga, fetchTasksWorkerSaga} from 'features/TodolistsList/tasks-sagas'
import {call, put} from 'redux-saga/effects'
import {setAppErrorAC, setAppStatusAC} from 'app/app-reducer'
import {GetTasksResponse, todolistsAPI} from 'api/todolists-api'
import {setTasksAC} from 'features/TodolistsList/tasks-reducer'

beforeEach(() => {

})

test('fetchTasksWorkerSaga success flow', () => {
		const todolistId = 'todolistId'
		const gen = fetchTasksWorkerSaga({type: 'TASKS/FETCH-TASKS', todolistId: todolistId})

		expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
		expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, todolistId))
		const fakeApiResponse: GetTasksResponse = {
				error: '',
				items: [],
				totalCount: 1,
		}
		expect(gen.next(fakeApiResponse).value).toEqual(put(setTasksAC([], todolistId)))
		expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')))
		expect(gen.next().done).toBeTruthy()
})

test('addTaskWorkerSaga error flow', () => {
		const todolistId = 'todolistId'
		const title = 'task title'
		const gen = addTaskWorkerSaga({type: 'TASKS/ADD-TASK', title, todolistId})

		expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
		expect(gen.next().value).toEqual(call(todolistsAPI.createTask, todolistId, title))
		expect(gen.throw({message: 'some error'}).value).toEqual(put(setAppErrorAC('some error')))
		expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
})