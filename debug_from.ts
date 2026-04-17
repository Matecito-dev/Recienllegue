import { createClient } from 'matecitodb'

const db = createClient('http://localhost:8090', { apiKey: 'test', apiVersion: 'v2' })
const usuarios = (db as any).from('usuarios')

console.log('--- MÉTODOS DE db.from("usuarios") ---')
console.log(Object.keys(usuarios))
console.log('Prototype de usuarios:', Object.keys(Object.getPrototypeOf(usuarios)))

// Verificamos si tiene signUp
console.log('¿Tiene signUp?', typeof usuarios.signUp === 'function')
console.log('¿Tiene create?', typeof usuarios.create === 'function')
console.log('¿Tiene auth?', typeof usuarios.auth === 'function' || !!usuarios.auth)
