import { createClient } from 'matecitodb'

const db = createClient('http://localhost:8090', { apiKey: 'test', apiVersion: 'v2' })

// Busco métodos comunes de acceso a tablas
const commonMethods = ['from', 'table', 'collection', 'get', 'select']
commonMethods.forEach(method => {
  console.log(`¿Existe db.${method}?`, typeof (db as any)[method] === 'function')
})

// Vemos si auth tiene algún método de configuración
if ((db as any).auth) {
  const authMethods = Object.keys(Object.getPrototypeOf((db as any).auth))
  console.log('Métodos en el prototipo de auth:', authMethods)
}
