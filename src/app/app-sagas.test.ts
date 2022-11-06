import {initializeAppWorkerSage} from 'app/app-sagas'
import {call, put} from 'redux-saga/effects'
import {authAPI, MeResponseType} from 'api/todolists-api'
import {setIsLoggedInAC} from 'features/Login/auth-reducer'
import {setAppInitializedAC} from 'app/app-reducer'

let meResponse: MeResponseType;

beforeEach(()=>{
		meResponse = {
				resultCode: 0,
				messages: [],
				data: {id: 0, email: '', login: ''},
		}
})

test('initializeAppWorkerSage login success', () => {
		const gen = initializeAppWorkerSage()
		expect(gen.next().value).toEqual(call(authAPI.me))
		expect(gen.next(meResponse).value).toEqual(put(setIsLoggedInAC(true)))
		expect(gen.next().value).toEqual(put(setAppInitializedAC(true)))
})
test('initializeAppWorkerSage login unsuccess', () => {
		const gen = initializeAppWorkerSage()
		expect(gen.next().value).toEqual(call(authAPI.me))
		meResponse.resultCode = 1
		expect(gen.next(meResponse).value).toEqual(put(setAppInitializedAC(true)))
})