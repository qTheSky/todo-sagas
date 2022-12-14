import axios, {AxiosResponse} from 'axios'

const settings = {
		withCredentials: true,
		headers: {
				'API-KEY': 'c0313221-8484-4768-9d93-144296373ae6'
		}
}
const instance = axios.create({
		baseURL: 'https://social-network.samuraijs.com/api/1.1/',
		...settings
})

// api
export const todolistsAPI = {
		getTodolists(): Promise<AxiosResponse<TodolistType[]>> {
				const promise = instance.get<TodolistType[]>('todo-lists');
				return promise;
		},
		createTodolist(title: string): Promise<AxiosResponse<ResponseType<{ item: TodolistType }>>> {
				const promise = instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
				return promise;
		},
		deleteTodolist(id: string) {
				const promise = instance.delete<ResponseType>(`todo-lists/${id}`);
				return promise;
		},
		updateTodolist(id: string, title: string) {
				const promise = instance.put<ResponseType>(`todo-lists/${id}`, {title: title});
				return promise;
		},
		getTasks(todolistId: string): Promise<GetTasksResponse> {
				return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`).then(res => res.data)
		},
		deleteTask(todolistId: string, taskId: string): Promise<AxiosResponse<ResponseType>> {
				return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
		},
		createTask(todolistId: string, taskTitle: string): Promise<ResponseType<{ item: TaskType }>> {
				return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title: taskTitle}).then(res => res.data)
		},
		updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType): Promise<AxiosResponse<ResponseType<TaskType>>> {
				return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
		}
}


export type LoginParamsType = {
		email: string
		password: string
		rememberMe: boolean
		captcha?: string
}

export type MeResponseType = ResponseType<{ id: number; email: string; login: string }>

export const authAPI = {
		login(data: LoginParamsType): Promise<ResponseType<{ userId?: number }>> {
				const promise = instance.post<ResponseType<{ userId?: number }>>('auth/login', data).then(res => res.data)
				return promise;
		},
		logout(): Promise<ResponseType<{ userId?: number }>> {
				const promise = instance.delete<ResponseType<{ userId?: number }>>('auth/login').then(res => res.data)
				return promise;
		},
		me() {
				const promise = instance.get<MeResponseType>('auth/me')
				return promise.then(res => res.data)
		}
}

// types
export type TodolistType = {
		id: string
		title: string
		addedDate: string
		order: number
}
export type ResponseType<D = {}> = {
		resultCode: number
		messages: Array<string>
		data: D
}

export enum TaskStatuses {
		New = 0,
		InProgress = 1,
		Completed = 2,
		Draft = 3
}

export enum TaskPriorities {
		Low = 0,
		Middle = 1,
		Hi = 2,
		Urgently = 3,
		Later = 4
}

export type TaskType = {
		description: string
		title: string
		status: TaskStatuses
		priority: TaskPriorities
		startDate: string
		deadline: string
		id: string
		todoListId: string
		order: number
		addedDate: string
}
export type UpdateTaskModelType = {
		title: string
		description: string
		status: TaskStatuses
		priority: TaskPriorities
		startDate: string
		deadline: string
}
export type GetTasksResponse = {
		error: string | null
		totalCount: number
		items: TaskType[]
}
