import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from '../../app/store'
import {changeTodolistFilterAC, FilterValuesType, TodolistDomainType} from './todolists-reducer'
import {TasksStateType} from './tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import {Grid, Paper} from '@material-ui/core'
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Redirect} from 'react-router-dom'
import {
		addTaskSagaActivator,
		removeTaskAc,
		updateTaskSagaActivator
} from 'features/TodolistsList/tasks-sagas'
import {
		addTodolistSagaActivator,
		changeTodolistTitleSagaActivator,
		fetchTodolists,
		removeTodolistSagaActivator
} from 'features/TodolistsList/todolists-sagas'

type PropsType = {
		demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
		const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
		const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
		const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

		const dispatch = useDispatch()

		useEffect(() => {
				if (demo || !isLoggedIn) {
						return;
				}
				dispatch(fetchTodolists())
		}, [])

		const removeTask = useCallback(function (id: string, todolistId: string) {
				dispatch(removeTaskAc(todolistId, id))
		}, [])

		const addTask = useCallback(function (title: string, todolistId: string) {
				dispatch(addTaskSagaActivator(todolistId, title))
		}, [])

		const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
				dispatch(updateTaskSagaActivator(todolistId, id, {status}))
		}, [])

		const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
				dispatch(updateTaskSagaActivator(todolistId, id, {title: newTitle}))
		}, [])

		const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
				const action = changeTodolistFilterAC(todolistId, value)
				dispatch(action)
		}, [])

		const removeTodolist = useCallback(function (id: string) {
				dispatch(removeTodolistSagaActivator(id))
		}, [])

		const changeTodolistTitle = useCallback(function (id: string, title: string) {
				dispatch(changeTodolistTitleSagaActivator(id, title))
		}, [])

		const addTodolist = useCallback((title: string) => {
				dispatch(addTodolistSagaActivator(title))
		}, [dispatch])

		if (!isLoggedIn) {
				return <Redirect to={'/login'}/>
		}

		return <>
				<Grid container style={{padding: '20px'}}>
						<AddItemForm addItem={addTodolist}/>
				</Grid>
				<Grid container spacing={3}>
						{
								todolists.map(tl => {
										let allTodolistTasks = tasks[tl.id]

										return <Grid item key={tl.id}>
												<Paper style={{padding: '10px'}}>
														<Todolist
																todolist={tl}
																tasks={allTodolistTasks}
																removeTask={removeTask}
																changeFilter={changeFilter}
																addTask={addTask}
																changeTaskStatus={changeStatus}
																removeTodolist={removeTodolist}
																changeTaskTitle={changeTaskTitle}
																changeTodolistTitle={changeTodolistTitle}
																demo={demo}
														/>
												</Paper>
										</Grid>
								})
						}
				</Grid>
		</>
}
