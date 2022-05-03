import fetch2 from 'node-fetch'
import FormData2 from 'form-data'
import { createServer,  } from '@graphql-yoga/node'
import { schema } from './schema.mjs'

const yoga = createServer({ schema, logging: false })

async function main() {
    const UPLOAD_MUTATION = /* GraphQL */ `
    mutation upload($file: File!) {
      singleUpload(file: $file) {
        name
        type
        text
      }
    }
  `

  const fileName = 'test.txt'
  const fileType = 'text/plain'
  const fileContent = 'Hello World'

  const formData = new FormData2()
  formData.append('operations', JSON.stringify({ query: UPLOAD_MUTATION }))
  formData.append('map', JSON.stringify({ 1: ['variables.file'] }))
  formData.append('1', fileContent, {
    filename: fileName,
    contentType: fileType,
  })

  const response = await fetch2(yoga.getServerUrl(), {
    method: 'POST',
    body: formData,
  })

  const body = await response.json()

  console.log(body)
} 

yoga.start().then(() => {

    setTimeout(() => {
        main().then(() => {
            yoga.stop()
        })
    }, 5000)
})
