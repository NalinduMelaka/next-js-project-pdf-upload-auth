

import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs/promises'
import { join } from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    const file = files.file as formidable.File
    const buffer = await fs.readFile(file.path)

    try {
      const path = join(process.cwd(), 'public', file.name)
      await fs.writeFile(path, buffer)

      res.status(200).json({ success: true, message: `File ${file.name} uploaded successfully` })
    } catch (error) {
      console.error('Error writing file:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })
}
