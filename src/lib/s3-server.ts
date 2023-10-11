import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'

export async function downloadFromS3(file_key: string) {
    try{
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        })
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'ap-southeast-1'
        })
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
        }

        const obj = await s3.getObject(params).promise()

        const directoryPath = path.join("/tmp", "your-app-name"); // Create directory path
        fs.mkdirSync(directoryPath, { recursive: true }); // Create the directory if it doesn't exist
        const file_name = path.join(
            directoryPath,
            `user${Date.now().toString()}.pdf`,
        );

        fs.writeFileSync(file_name, obj.Body as Buffer)
        return file_name
    }catch(error){
        console.log(error)
        return null
    }
}